import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { QUERY_PACKAGE, DELETE_PACKAGE } from "../../services/Graphql"
import { useQuery, useMutation } from "@apollo/client"
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { DatePicker } from 'antd'
import dayjs from "dayjs"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

const EditPackage = () => {
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const [DELETE_PACKAGE_MUTATION] = useMutation(DELETE_PACKAGE)
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [price, setPrice] = useState()
    const [tableTime, setTableTime] = useState([])
    const [meeting_point, setMeetingPoint] = useState('')
    const [max_people, setMaxPeople] = useState()
    const [description, setDescription] = useState('')
    const [duration, setDuration] = useState()
    const [accommodation, setAccommodation] = useState('')
    const [price_includes, setPriceInclude] = useState('')
    const [tourist_attraction, setTouristAttraction] = useState('')
    const [district, setDistrict] = useState('')
    const [province, setProvince] = useState('')
    const [with_accommodation, setWithAccommodation] = useState()

    const [sector, setSector] = useState(['north', 'south', 'west', 'east', 'central'])
    const [selectedSector, setSelectedSector] = useState('')

    const [type, setType] = useState(['Nature And Mountain Tour', 'Cultural And Historical Tour', 'Adventure Tour', 'Family Tour', 'Honeymoon & Romantic Tour'])
    const [selectedType, setSelectedType] = useState('')

    const [publish, setPublish] = useState(['Publish', 'Draft'])
    const [selectPublish, setSelectPublish] = useState('')

    const [image, setImage] = useState({})
    const [thumbnail, setThumbnail] = useState()
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [imageFiles, setImageFiles] = useState([])


    const [newThumbnail, setNewThumbnail] = useState()
    const [newImage, setNewImage] = useState([])
    function handleUploadThumbnail(e) {
        setNewThumbnail(URL.createObjectURL(e.target.files[0]))
        setThumbnailFile(e.target.files[0])
    }
    function handleUploadImage(e) {
        const files = e.target.files
        const newFileURLs = Array.from(files).map(file => URL.createObjectURL(file))
        setImageFiles(prev => [...prev, ...files])
        setNewImage(prevImageURLs => [...prevImageURLs, ...newFileURLs])
    }

    const { documentId } = useParams()
    console.log(documentId)
    const { data: dataPackage, loading: loadingPackage, error: errorPackage } = useQuery(QUERY_PACKAGE, {
        variables: {
            documentId: documentId
        }
    })


    const handleDelete = async () => {
        try {
            await DELETE_PACKAGE_MUTATION({
                variables: {
                    documentId: documentId
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                }
            })
        } catch (error) {
            console.log(error)
        }
        navigate('/admin/package')
    }

    const handleSave = async () => {
        try {
            let imageIds = []
            if (imageFiles.length > 0) {
                const imagesFormData = new FormData()
                imageFiles.forEach(file => imagesFormData.append('files', file))
                const uploadImageRes = await axios.post(`${strapiBaseURL}/api/upload`, imagesFormData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                imageIds = uploadImageRes.data.map(file => file.id)
            }

            let ThumbnailIds = null
            if (thumbnailFile) {
                const ThumbnailFormData = new FormData()
                ThumbnailFormData.append('files', thumbnailFile)
                const uploadThumbnailRes = await axios.post(`${strapiBaseURL}/api/upload`, ThumbnailFormData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })
                ThumbnailIds = uploadThumbnailRes.data[0].id
                console.log(ThumbnailIds)
            }
            if (!dataPackage || !dataPackage.package) {
                throw new Error("Package data is not available");
            }

            console.log(dataPackage.package.location);

            const locationRes = await axios.put(`${strapiBaseURL}/api/locations/${dataPackage.package.location.documentId}`, {
                data: {
                    province: province,
                    district: district,
                    sector: selectedSector
                }
            },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                })
            const detailRes = await axios.put(`${strapiBaseURL}/api/packagedetails/${dataPackage.package.detail.documentId}`, {
                data: {
                    accommodation: accommodation,
                    price_includes: price_includes,
                    tourist_attraction: tourist_attraction
                },
            },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                })

            console.log(imageIds)

            // สร้าง array ของ image documentId เก่า
            const existingImageIds = dataPackage.package.image.map(img => img.documentId);

            // สร้าง thumbnailId ตามเงื่อนไข
            const thumbnailId = ThumbnailIds
                ? ThumbnailIds
                : dataPackage.package.thumbnail?.documentId;

            const packageRes = await axios.put(`${strapiBaseURL}/api/packages/${documentId}`, {
                data: {
                    name: name,
                    price: price,
                    duration: duration,
                    // image: [...existingImageIds, ...imageIds], // รวมรูปเก่า + ใหม่
                    location: locationRes.data.data.documentId,
                    max_people: max_people,
                    meeting_point: meeting_point,
                    description: description,
                    thumbnail: thumbnailId, // ใช้ thumbnail ใหม่หรือเก่า
                    detail: detailRes.data.data.documentId,
                    with_accommodation: with_accommodation,
                    type: selectedType,
                    status_package: selectPublish
                },
            },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    },
                });

            const timeRes = await Promise.all(
                tableTime.map(async (time) => {
                    if (time.documentId) { // มี documentId = อัพเดท
                        const res = await axios.put(`${strapiBaseURL}/api/timetables/${time.documentId}`, {
                            data: {
                                start: time.start,
                                end: time.end,
                                package: packageRes.data.data.documentId
                            },
                        },
                            {
                                headers: {
                                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                                },
                            })
                        return res.data.data.documentId
                    } else { // ไม่มี documentId = สร้างใหม่
                        const res = await axios.post(`${strapiBaseURL}/api/timetables`, {
                            data: {
                                start: time.start,
                                end: time.end,
                                package: packageRes.data.data.documentId
                            },
                        },
                            {
                                headers: {
                                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                                },
                            })
                        return res.data.data.documentId
                    }
                })
            )

            const existingTimetables = dataPackage.package.timetables.map(t => t.documentId);
            const removedTimetables = existingTimetables.filter(id => !tableTime.some(t => t.documentId === id));
            await Promise.all(
                removedTimetables.map(async (id) => {
                    await axios.delete(`${strapiBaseURL}/api/timetables/${id}`, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        },
                    });
                })
            );

            console.log(timeRes)

            console.log(locationRes, detailRes)
            console.log(packageRes)
        } catch (error) {
            if (error.response) {
                console.log("Error response data:", error.response.data);
            } else {
                console.log("Error:", error.message);
            }
        }
    }
    console.log(tableTime)

    useEffect(() => {
        setName(dataPackage?.package?.name)
        setPrice(dataPackage?.package?.price)
        setTableTime(Array.from(new Map(dataPackage?.package?.timetables.map(time => [time.documentId, time])).values()))
        setMeetingPoint(dataPackage?.package.meeting_point)
        setMaxPeople(dataPackage?.package?.max_people)
        setDescription(dataPackage?.package?.description)
        setDuration(dataPackage?.package?.duration)
        setAccommodation(dataPackage?.package?.detail?.accommodation)
        setPriceInclude(dataPackage?.package?.detail?.price_includes)
        setTouristAttraction(dataPackage?.package?.detail?.tourist_attraction)
        setDistrict(dataPackage?.package?.location?.district)
        setProvince(dataPackage?.package?.location?.province)
        setSelectPublish(dataPackage?.package?.status_package)
        setSelectedSector(dataPackage?.package?.location?.sector)
        setSelectedType(dataPackage?.package?.type?.split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ") || "");
        setImage(dataPackage?.package?.image)
        setThumbnail(dataPackage?.package?.thumbnail?.url)
        setWithAccommodation(dataPackage?.package?.with_accommodation)
    }, [dataPackage])
    console.log('Type : ', selectedType)

    useEffect(() => {
        console.log(thumbnail, image)
    }, [thumbnail, image])
    if (loadingPackage) {
        return <p>Loading</p>
    }
    if (errorPackage) {
        return <p>{errorPackage}</p>
    }
    const onTypeChange = (e) => {
        setWithAccommodation(e)
    }
    const handleDateChange = (index, field, date) => {
        setTableTime((prevTimetables) =>
            prevTimetables.map((timetable, i) =>
                i === index ? { ...timetable, [field]: date } : timetable
            )
        );
    };
    const AddTimeTable = () => {
        setTableTime([...tableTime, { start: null, end: null }])
    }
    const RemoveTimeTableAtIndex = (index) => {
        setTableTime(prevTimetables => prevTimetables.filter((_, i) => i !== index));
    }

    console.log(dataPackage)
    return (
        <div>
            <form>
                <div className="space-y-12 sm:space-y-16">
                    <div>
                        <h2 className="text-4xl font-semibold text-gray-900">แก้ไขแพ็คเกจทัวร์</h2>
                        <p className="mt-1 max-w-2xl text-xl text-gray-600">
                            คุณสามารถแก้ไขแพ็คเกจทัวร์ได้จากหน้านี้
                        </p>
                        <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    สถานะแพ็กเกจ
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <Listbox value={selectPublish} onChange={setSelectPublish}>
                                        <div className="relative mt-2">
                                            <ListboxButton className="grid w-xs cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-sm/6 h-11 items-center">
                                                <span className="col-start-1 row-start-1 truncate pr-6 text-base">{!selectPublish ? 'เลือกสถานะแพ็กเกจ' : selectPublish === 'Publish' ? 'เผยแพร่' : 'ฉบับร่าง'}</span>
                                                <ChevronUpDownIcon
                                                    aria-hidden="true"
                                                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                                />
                                            </ListboxButton>

                                            <ListboxOptions
                                                transition
                                                className="absolute z-10 mt-1 max-h-60 w-xs overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                                            >
                                                {publish.map((type) => (
                                                    <ListboxOption
                                                        key={type}
                                                        value={type}
                                                        className="group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none data-focus:bg-[#F8644B] data-focus:text-white data-focus:outline-hidden"
                                                    >
                                                        <span className="block truncate font-normal group-data-selected:font-semibold text-base">{type === 'Publish' ? 'เผยแพร่' : 'ฉบับร่าง'}</span>
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-[#F8644B]group-not-data-selected:hidden group-data-focus:text-white">
                                                        </span>
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>
                            </div>


                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    ชื่อแพ็กเกจทัวร์
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">
                                        <div className="shrink-0 text-lg text-gray-500 select-none sm:text-lg"></div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    ราคา
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                        <div className="shrink-0 text-lg text-gray-500 select-none sm:text-lg mr-3">บาท</div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    จุดนัดพบ
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={meeting_point}
                                            onChange={(e) => setMeetingPoint(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    ระยะเวลา
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                        <div className="shrink-0 text-lg text-gray-500 select-none sm:text-lg mr-3">วัน</div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="about" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    รายละเอียดแพ็กเกจ
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <textarea
                                        rows={5}
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-2xl sm:text-lg"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <p className="mt-3 text-lg text-gray-600">อธิบายเกี่ยวกับแพ็กเกจทัวร์</p>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    สไตล์การท่องเที่ยว
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <Listbox value={selectedType} onChange={setSelectedType}>
                                        <div className="relative mt-2">
                                            <ListboxButton className="grid w-xs cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-sm/6 h-11 items-center">
                                                <span className="col-start-1 row-start-1 truncate pr-6 text-base">{!selectedType ? 'เลือกสไตลด์การท่องเที่ยว' : selectedType === 'Nature And Mountain Tour' ? 'ธรรมชาติและภูเขา' : selectedType === 'Cultural And Historical Tour' ? 'วัฒนธรรมและประวัติศาสตร์' : selectedType === 'Adventure Tour' ? 'ผจญภัย' : selectedType === 'Family Tour' ? 'ครอบครัว' : 'ฮันนีมูนและโรแมนติก'}</span>
                                                <ChevronUpDownIcon
                                                    aria-hidden="true"
                                                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                                />
                                            </ListboxButton>

                                            <ListboxOptions
                                                transition
                                                className="absolute z-10 mt-1 max-h-60 w-xs overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                                            >
                                                {type.map((type) => (
                                                    <ListboxOption
                                                        key={type}
                                                        value={type}
                                                        className="group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none data-focus:bg-[#F8644B] data-focus:text-white data-focus:outline-hidden"
                                                    >
                                                        <span className="block truncate font-normal group-data-selected:font-semibold text-base">{type === 'Nature And Mountain Tour' ? 'ธรรมชาติและภูเขา' : type === 'Cultural And Historical Tour' ? 'วัฒนธรรมและประวัติศาสตร์' : type === 'Adventure Tour' ? 'ผจญภัยและกิจกรรมกลางแจ้ง' : type === 'Family Tour' ? 'ครอบครัว' : 'ฮันนีมูนและโรแมนติก'}</span>
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-[#F8644B]group-not-data-selected:hidden group-data-focus:text-white">
                                                        </span>
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    จำนวนลูกค้าสูงสุด
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={max_people}
                                            onChange={(e) => setMaxPeople(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                        <div className="shrink-0 text-lg text-gray-500 select-none sm:text-lg mr-3">คน</div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    ราคานี้รวมอะไรบ้าง?
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={price_includes}
                                            onChange={(e) => setPriceInclude(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    สถานที่ท่องเที่ยว
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={tourist_attraction}
                                            onChange={(e) => setTouristAttraction(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    อำเภอ
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    จังหวัด
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">

                                        <input
                                            type="text"
                                            value={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    ภาค
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <Listbox value={selectedSector} onChange={setSelectedSector}>
                                        <div className="relative mt-2">
                                            <ListboxButton className="grid w-xs cursor-default grid-cols-1 text-base rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base items-center h-11">
                                                <span className="col-start-1 row-start-1 truncate pr-6 text-base">{!selectedSector ? 'เลือกภาค' : selectedSector === 'north' ? 'ภาคเหนือ' : selectedSector === 'south' ? 'ภาคใต้' : selectedSector === 'central' ? 'ภาคกลาง' : selectedSector === 'east' ? 'ภาคตะวันออก' : 'ภาคตะวันออกเฉียงเหนือ'}</span>
                                                <ChevronUpDownIcon
                                                    aria-hidden="true"
                                                    className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                                />
                                            </ListboxButton>

                                            <ListboxOptions
                                                transition
                                                className="absolute z-10 mt-1 max-h-60 w-xs overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                                            >
                                                {sector.map((sector) => (
                                                    <ListboxOption
                                                        key={sector}
                                                        value={sector}
                                                        className="group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none data-focus:bg-[#F8644B] data-focus:text-white data-focus:outline-hidden"
                                                    >
                                                        <span className="block truncate font-normal group-data-selected:font-semibold text-base">{sector === 'north' ? 'ภาคเหนือ' : sector === 'south' ? 'ภาคใต้' : sector === 'central' ? 'ภาคกลาง' : sector === 'east' ? 'ภาคตะวันออก' : 'ภาคตะวันออกเฉียงเหนือ'}</span>

                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-[#F8644B] group-not-data-selected:hidden group-data-focus:text-white">
                                                        </span>
                                                    </ListboxOption>
                                                ))}
                                            </ListboxOptions>
                                        </div>
                                    </Listbox>
                                </div>
                            </div>

                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="cover-photo" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    ภาพหน้าปก
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex max-w-2xl justify-center rounded-md border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            {(!thumbnail && !newThumbnail) && <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />}
                                            <div>
                                                {(thumbnail && !newThumbnail) && <img src={`${strapiBaseURL}${thumbnail}`} className="object-cover w-50 h-50 rounded-xl" />}
                                                {(newThumbnail) && <img src={`${newThumbnail}`} className="object-cover w-50 h-50 rounded-xl" />}
                                            </div>
                                            <div className="mt-6 flex text-lg flex-col items-center justify-center text-gray-600">
                                                <label
                                                    htmlFor="thumnail-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="thumnail-upload" name="file-upload" type="file" onChange={handleUploadThumbnail} className="sr-only" />
                                                </label>
                                            </div>

                                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="cover-photo" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    ภาพประกอบ
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div className="flex max-w-2xl justify-center rounded-base border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            {(!image) && <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />}
                                            {
                                                <div className="flex flex-row flex-wrap gap-2">
                                                    {(image) && image.map((image, index) => (<img src={`${strapiBaseURL}${image.url}`} key={index} className="lg:col-span-3 object-cover w-50 h-50 rounded-xl" />))}
                                                    {(newImage) && newImage.map((image, index) => (<img src={`${image}`} key={index} className="lg:col-span-3 object-cover w-50 h-50 rounded-xl" />))}
                                                </div>
                                            }
                                            <div className="mt-6 flex text-lg flex-col items-center justify-center text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="file-upload" name="file-upload" type="file" multiple accept="image/*" onChange={handleUploadImage} className="sr-only" />
                                                </label>
                                            </div>
                                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <fieldset>
                                <legend className="sr-only">Push notifications</legend>
                                <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:py-6">
                                    <div aria-hidden="true" className="text-lg font-semibold text-gray-900">
                                        ประเภทของแพ็คเกจ
                                    </div>
                                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                                        <div className="max-w-base">
                                            <div className="mt-6 space-y-6">
                                                <div className="flex items-center gap-x-3">
                                                    <input
                                                        defaultChecked
                                                        name="packageType"
                                                        checked={with_accommodation === false}
                                                        id="onedaytrip"
                                                        type="radio"
                                                        onChange={() => onTypeChange(false)}
                                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                    />
                                                    <label htmlFor="onedaytrip" className="block text-lg font-medium text-gray-900">
                                                        แพ็กเกจทัวร์วันเดียว
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-x-3">
                                                    <input
                                                        id="accommodation"
                                                        name="packageType"
                                                        checked={with_accommodation === true}
                                                        onChange={() => onTypeChange(true)}
                                                        type="radio"
                                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                    />
                                                    <label htmlFor="accommodation" className="block text-lg font-medium text-gray-900">
                                                        แพ็กเกจทัวร์พร้อมที่พัก
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            {with_accommodation &&
                                (<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                    <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                        ที่พัก
                                    </label>
                                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                                        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 sm:max-w-md">
                                            <input
                                                type="text"
                                                value={accommodation}
                                                onChange={(e) => setAccommodation(e.target.value)}
                                                className="block min-w-0 grow py-1.5 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                                )
                            }
                            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                                <label htmlFor="username" className="block text-lg font-medium text-gray-900 sm:pt-1.5">
                                    วันเริ่มทัวร์ และ วันสิ้นสุดทัวร์
                                </label>
                                <div className="mt-2 sm:col-span-2 sm:mt-0">
                                    <div>
                                        {tableTime?.map((timetable, index) => (
                                            <div key={`${timetable.documentId}-${index}`} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                                                <DatePicker
                                                    className="h-11 w-40"
                                                    defaultValue={timetable.start && dayjs(timetable.start)}
                                                    onChange={(date) => handleDateChange(index, "start", date)}
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                />
                                                <span> - </span>
                                                <DatePicker
                                                    className="h-11 w-40"
                                                    defaultValue={timetable.end && dayjs(timetable.end)}
                                                    onChange={(date) => handleDateChange(index, "end", date)}
                                                    showTime
                                                    format="YYYY-MM-DD HH:mm:ss"
                                                />
                                                {tableTime.length > 1 && (
                                                    <button
                                                        onClick={() => RemoveTimeTableAtIndex(index)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                                    >
                                                        ลบ
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p
                                        onClick={() => AddTimeTable()}
                                        className="bg-[#F8644B] w-40 p-2 text-center rounded-md text-white cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100"
                                    >
                                        เพิ่มรอบทัวร์
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex items-center justify-end gap-x-6">
                    <button onClick={()=>{handleDelete()}}>ลบแพ็กเกจทัวร์</button>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-lg font-semibold text-gray-900 cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100" onClick={() => { navigate(-1) }}>
                            ยกเลิก
                        </button>
                        <p
                            type="submit"
                            onClick={() => handleSave().then(() => navigate('/package_manage'))}
                            className="inline-flex justify-center rounded-md bg-[#F8644B] px-3 py-2 text-lg  text-white shadow-xs 
                        cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100"
                        >
                            บันทึกการเปลี่ยนแปลง
                        </p>
                    </div>
                </div>

            </form>
        </div>
    )
}
export default EditPackage