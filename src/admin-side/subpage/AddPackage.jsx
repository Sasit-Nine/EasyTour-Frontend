import React, { useEffect, useState } from "react"
import { UPDATE_PACKAGE } from "../../services/Graphql"
import { useMutation } from "@apollo/client"
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { DatePicker } from 'antd'
import axios from "axios"
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"
import {
    XMarkIcon,
} from '@heroicons/react/24/outline'

const AddPackage = () => {
    const [notFilled, setNotFilled] = useState(false)
    const validateForm = () => {
        const newErrors = {};

        if (!name) newErrors.name = "กรุณากรอกชื่อแพ็คเกจทัวร์";
        if (!price) newErrors.price = "กรุณากรอกราคา";
        if (!meeting_point) newErrors.meeting_point = "กรุณากรอกจุดนัดพบ";
        if (!max_people) newErrors.max_people = "กรุณากรอกจำนวนลูกค้าสูงสุด";
        if (!description) newErrors.description = "กรุณากรอกรายละเอียดแพ็คเกจ";
        if (!duration) newErrors.duration = "กรุณากรอกระยะเวลา";
        if (!price_includes) newErrors.price_includes = "กรุณากรอกราคานี้รวมอะไรบ้าง";
        if (!tourist_attraction) newErrors.tourist_attraction = "กรุณากรอกสถานที่ท่องเที่ยว";
        if (!district) newErrors.district = "กรุณากรอกอำเภอ";
        if (!province) newErrors.province = "กรุณากรอกจังหวัด";
        if (!selectedSector) newErrors.selectedSector = "กรุณาเลือกภาค";
        if (!selectedType) newErrors.selectedType = "กรุณาเลือกสไตล์การท่องเที่ยว";
        if (!selectPublish) newErrors.selectPublish = "กรุณาเลือกสถานะแพ็คเกจ";
        if (!thumbnailFile) newErrors.thumbnail = "กรุณาอัปโหลดภาพหน้าปก";
        if (imageFiles.length === 0) newErrors.image = "กรุณาอัปโหลดภาพประกอบ";

        if (Object.keys(newErrors).length > 0) return newErrors;
        return true; // คืนค่า true หากไม่มีข้อผิดพลาด
    };

    const navagate = useNavigate()
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const [name, setName] = useState('')
    const [price, setPrice] = useState()
    const [tableTime, setTableTime] = useState([{ start: null, end: null }])
    const [meeting_point, setMeetingPoint] = useState('')
    const [max_people, setMaxPeople] = useState()
    const [description, setDescription] = useState('')
    const [duration, setDuration] = useState()
    const [accommodation, setAccommodation] = useState('')
    const [price_includes, setPriceInclude] = useState('')
    const [tourist_attraction, setTouristAttraction] = useState('')
    const [district, setDistrict] = useState('')
    const [province, setProvince] = useState('')

    const [sector, setSector] = useState(['north', 'south', 'east', 'central', 'northeast'])
    const [selectedSector, setSelectedSector] = useState('')

    const [type, setType] = useState(['Nature And Mountain Tour', 'Cultural And Historical Tour', 'Adventure Tour', 'Family Tour', 'Honeymoon & Romantic Tour'])
    const [selectedType, setSelectedType] = useState('')

    const [publish, setPublish] = useState(['Publish', 'Draft'])
    const [selectPublish, setSelectPublish] = useState('')

    const [image, setImage] = useState([])
    const [thumbnail, setThumbnail] = useState()
    const [with_accommodation, setWithAccommodation] = useState()
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [imageFiles, setImageFiles] = useState([])

    function handleUploadThumbnail(e) {
        setThumbnail(URL.createObjectURL(e.target.files[0]))
        setThumbnailFile(e.target.files[0])
    }
    function handleUploadImage(e) {
        const files = e.target.files
        const newFileURLs = Array.from(files).map(file => URL.createObjectURL(file))
        setImageFiles(prev => [...prev, ...files])
        setImage(prevImageURLs => [...prevImageURLs, ...newFileURLs])
    }
    function handleClearThumbnail() {
        setThumbnail()
    }
    function handleClearImage() {
        setImage([])
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

    const handleSave = async () => {
        const isValid = validateForm()
        if (isValid !== true) {
            setNotFilled(true)
            return
        }

        try {
            const imagesFormData = new FormData()
            imageFiles.forEach(file => imagesFormData.append('files', file))
            const uploadImageRes = await axios.post(`${strapiBaseURL}/api/upload`, imagesFormData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            const imageIds = uploadImageRes.data.map(file => file.id)

            const ThumbnailFormData = new FormData()
            ThumbnailFormData.append('files', thumbnailFile)
            const uploadThumbnailRes = await axios.post(`${strapiBaseURL}/api/upload`, ThumbnailFormData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            const ThumbnailIds = uploadThumbnailRes.data[0].id
            console.log(ThumbnailIds)

            const locationRes = await axios.post(`${strapiBaseURL}/api/locations`, {
                data: {
                    province: province,
                    district: district,
                    sector: selectedSector
                }
            },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    },
                })
            const detailRes = await axios.post(`${strapiBaseURL}/api/packagedetails`, {
                data: {
                    accommodation: accommodation,
                    price_includes: price_includes,
                    tourist_attraction: tourist_attraction
                },
            },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    },
                })

            console.log(imageIds)
            console.log(selectedSector)
            const packageRes = await axios.post(`${strapiBaseURL}/api/packages`, {
                data: {
                    name: name,
                    price: price,
                    duration: duration,
                    image: imageIds,
                    location: locationRes.data.data.documentId,
                    max_people: max_people,
                    meeting_point: meeting_point,
                    description: description,
                    thumbnail: ThumbnailIds,
                    detail: detailRes.data.data.documentId,
                    with_accommodation: with_accommodation,
                    type: selectedType,
                    status_package: selectPublish
                },
            },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    },
                })

            const timeRes = await Promise.all(
                tableTime.map(async (time) => {
                    const res = await axios.post(`${strapiBaseURL}/api/timetables`, {
                        data: {
                            start: time.start,
                            end: time.end,
                            package: packageRes.data.data.documentId
                        },
                    },
                        {
                            headers: {
                                Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                            },
                        })
                    return res.data.data.documentId
                })
            )

            console.log(timeRes)

            console.log(locationRes, detailRes)
            console.log(packageRes)
        } catch (error) {
            console.log(error)
        }
        navagate('/',{
            state:{
                add: true
            }
        })
    }
    console.log(tableTime)

    const RemoveTimeTableAtIndex = (index) => {
        setTableTime(prevTimetables => prevTimetables.filter((_, i) => i !== index));
    }

    const handleDeleteImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setImage(prev => prev.filter((_, i) => i !== index))
    }

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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">
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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

                                        <input
                                            type="number"
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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

                                        <input
                                            type="number"
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
                                        className="block w-full rounded-md bg-white px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:max-w-2xl sm:text-lg"
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
                                                <span className="col-start-1 row-start-1 truncate pr-6 text-base">{!selectedType ? 'เลือกสไตลด์การท่องเที่ยว' : selectedType === 'Nature And Mountain Tour' ? 'ธรรมชาติและภูเขา' : selectedType === 'Cultural And Historical Tour' ? 'วัฒนธรรมและประวัติศาสตร์' : selectedType === 'Adventure Tour' ? 'ผจญภัยและกิจกรรมกลางแจ้ง' : selectedType === 'Family Tour' ? 'ครอบครัว' : 'ฮันนีมูนและโรแมนติก'}</span>
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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

                                        <input
                                            type="number"
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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

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
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">

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
                                    <div className="flex max-w-2xl justify-center rounded-base border border-dashed border-gray-900/25 px-6 py-10">
                                        <div className="text-center">
                                            {(!thumbnail) && <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />}
                                            <div>
                                                {(thumbnail) && <img src={`${thumbnail}`} className="object-cover w-50 h-50 rounded-xl" />}
                                            </div>
                                            <div className="mt-6 flex text-lg flex-col items-center justify-center text-gray-600">
                                                <label
                                                    htmlFor="thumbnail-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#F8644B] focus-within:ring-2 focus-within:ring-[#F8644B] focus-within:ring-offset-2 focus-within:outline-hidden hover:text-[#F8644B]"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="thumbnail-upload" name="file-upload" type="file" onChange={handleUploadThumbnail} className="sr-only" />
                                                </label>

                                            </div>
                                            <p className="text-base text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                            <p className="text-base text-red-700 cursor-pointer" onClick={() => handleClearThumbnail()}>ล้างภาพปก</p>
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
                                            {(!Array.isArray(image)) && <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />}
                                            <div className="flex flex-row flex-wrap gap-2">
                                                {(Array.isArray(image)) && image.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img src={image} key={index} className="lg:col-span-3 object-cover w-50 h-50 rounded-xl" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteImage(index)} // ส่งเฉพาะ index
                                                            className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg hover:bg-red-600"
                                                        >
                                                            ลบ
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-6 flex text-lg flex-col items-center justify-center text-gray-600">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#F8644B] focus-within:ring-2 focus-within:ring-[#F8644B] focus-within:ring-offset-2 focus-within:outline-hidden hover:text-[#F8644B]"
                                                >
                                                    <span>Upload a file</span>
                                                    <input id="image-upload" type="file" multiple accept="image/*" onChange={handleUploadImage} className="sr-only" />
                                                </label>

                                            </div>
                                            <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                            <p className="text-base text-red-700 cursor-pointer" onClick={() => handleClearImage()}>ล้างภาพประกอบ</p>
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
                                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#F8644B] checked:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8644B] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
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
                                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#F8644B] checked:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8644B] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
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
                                        <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#F8644B] sm:max-w-md">
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

                {(notFilled) && <div className="rounded-xl bg-red-50 p-4 mt-5">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-lg font-medium text-red-800">กรุณากรอกข้อมูลให้ครบ</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    type="button"
                                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-hidden"
                                >
                                    <span className="sr-only">ปิด</span>

                                    <XMarkIcon aria-hidden="true" className="size-5 cursor-pointer" onClick={() => setNotFilled(false)} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-lg cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100 text-gray-900" onClick={() => { navagate('/') }}>
                        ยกเลิก
                    </button>
                    <p
                        type="submit"
                        onClick={() => handleSave()}
                        className="inline-flex justify-center rounded-md bg-[#F8644B] px-3 py-2 text-lg  text-white shadow-xs 
                        cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100"
                    >
                        สร้างแพ็กเกจทัวร์
                    </p>
                </div>
            </form>
        </div>
    )
}
export default AddPackage