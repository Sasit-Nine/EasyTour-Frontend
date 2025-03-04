import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import {
    ChartBarSquareIcon,
    Cog6ToothIcon,
    FolderIcon,
    GlobeAltIcon,
    ServerIcon,
    SignalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { CHANGE_PASSWORD } from '../../services/Graphql'
import axios from 'axios'
import { useEffect } from 'react'
import profile from "../../assets/profile.jpg";
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useMutation } from '@apollo/client'
import { Variable } from 'lucide-react'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const Settings = () => {
    const [ChangePW] = useMutation(CHANGE_PASSWORD)
    const [uId, setUid] = useState()
    const [fname, setName] = useState('')
    const [lname, setLname] = useState('')
    const [tel, setTel] = useState('')
    const [addr, setAddr] = useState('')
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [province, setProvince] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [imgUrl, setImgUrl] = useState()
    const [imgFile, setImgFile] = useState()
    const [newImgUrl, setnewImgUrl] = useState()
    const [updataSuccess, setUpdateSuccess] = useState(false)
    const [updateError, setUpdateError] = useState(false)
    const [notMacth, setNotMacth] = useState(false)
    const [updatePWSS , setPWSS] = useState(false)
    const [filledData ,setFilledData] = useState(false)
    const [pwFilled , setPwFilled] = useState(false)

    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const fetchUser = async () => {
        try {
            const DataUser = await axios.get(`${strapiBaseURL}/api/users/me?populate=*`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                }
            })
            return DataUser.data
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        const getUserData = async () => {
            const userData = await fetchUser()
            console.log(userData)
            if (userData) {
                setUid(userData.id || '')
                setName(userData.fname || '')
                setLname(userData.lname || '')
                setTel(userData.tel || '')
                setAddr(userData.address || '')
                setCity(userData.city || '')
                setDistrict(userData.district || '')
                setProvince(userData.province || '')
                setImgUrl(userData.profile_picture)
            }
        }
        getUserData()
    }, [])

    const handleUploadProfile = (e) => {
        setnewImgUrl(URL.createObjectURL(e.target.files[0]))
        setImgFile(e.target.files[0])
    }

    const handleSave = async () => {
        if (fname === '' || lname === '' || tel === '' || addr === '' || city === ''  || district=== '' || province === ''){
            setFilledData(true)
            return
        }
        if (imgFile && imgUrl) {
            console.log(imgUrl)
            const DelImgRes = await axios.delete(`${strapiBaseURL}/api/upload/files/${imgUrl?.id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                }
            })
            console.log(DelImgRes)
            const formData = new FormData()
            formData.append('files', imgFile)
            const UpImgRes = await axios.post(`${strapiBaseURL}/api/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                }
            })
            console.log(UpImgRes.data)
            const UpdateRes = await axios.put(`${strapiBaseURL}/api/users/${uId}`,
                {
                    fname: fname,
                    lname: lname,
                    address: addr,
                    tel: tel,
                    province: province,
                    district: district,
                    city: city,
                    profile_picture: UpImgRes.data[0].id
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    }
                })
            UpdateRes.status === 200 ? setUpdateSuccess(true) : setUpdateError(true)
            console.log(UpdateRes)
        } else if (imgFile) {
            const formData = new FormData()
            formData.append('files', imgFile)
            const UpImgRes = await axios.post(`${strapiBaseURL}/api/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                }
            })
            console.log(UpImgRes.data)
            const UpdateRes = await axios.put(`${strapiBaseURL}/api/users/${uId}`,
                {
                    fname: fname,
                    lname: lname,
                    address: addr,
                    tel: tel,
                    province: province,
                    district: district,
                    city: city,
                    profile_picture: UpImgRes.data[0].id
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    }
                })
            UpdateRes.status === 200 ? setUpdateSuccess(true) : setUpdateError(true)
            console.log(UpdateRes)
        }
        else if(!imgUrl) {
            const UpdateRes = await axios.put(`${strapiBaseURL}/api/users/${uId}`,
                {
                    fname: fname,
                    lname: lname,
                    address: addr,
                    tel: tel,
                    province: province,
                    district: district,
                    city: city,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    }
                })
            console.log(UpdateRes)
            UpdateRes.status === 200 ? setUpdateSuccess(true) : setUpdateError(true)
        }
        else {
            const UpdateRes = await axios.put(`${strapiBaseURL}/api/users/${uId}`,
                {
                    fname: fname,
                    lname: lname,
                    address: addr,
                    tel: tel,
                    province: province,
                    district: district,
                    city: city,
                    profile_picture: imgUrl.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                    }
                })
            console.log(UpdateRes)
            UpdateRes.status === 200 ? setUpdateSuccess(true) : setUpdateError(true)
        }
    }

    const handleChangePassword = async () => {
        if (confirm_password===''||newPassword===''|password===''){
            setPwFilled(true)
            return
        }
        if (confirm_password !== newPassword) {
            setNotMacth(true)
            console.log(password)
            console.log(newPassword)
            console.log(confirm_password)
            console.log('Heloo')
            return
        } else {
            console.log(password)
            console.log(newPassword)
            console.log(confirm_password)
            try {
                const { data: DataChangePW, loading: ChangeLoading} = await ChangePW({
                    variables: {
                        currentPassword: password,
                        password: newPassword,
                        passwordConfirmation: confirm_password,
                    },
                    context: {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                        },
                    }
                })
                if (ChangeLoading) {
                    console.log(ChangeLoading)
                }
                console.log(DataChangePW)
                if(DataChangePW.changePassword){
                    setPWSS(true)
                }
            } catch (error) {
                setUpdateError(true)
                console.log(error)
            }
        }
    }

    return (
        <div className='flex justify-center items-center '>
            <main>
                {/* Settings forms */}
                <div className="divide-y divide-gray-200">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">ข้อมูลส่วนตัว</h2>
                            <p className="mt-1 text-lg text-gray-600">คุณสามารถแก้ไขข้อมูลส่วนตัวของบัญชีคุณได้ที่นี่</p>
                        </div>

                        <form className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                <div className="col-span-full flex items-center gap-x-8">
                                    <img
                                        alt=""
                                        src={newImgUrl ? newImgUrl : imgUrl ? `${strapiBaseURL}${imgUrl.url}` : profile}
                                        className="size-24 flex-none rounded-lg bg-gray-100 object-cover"
                                    />
                                    <div>
                                        <label
                                            htmlFor="profile-picture"
                                            className="rounded-xl bg-gray-100 px-3 py-2 text-lg font-semibold text-gray-900 shadow-xs hover:bg-gray-200 cursor-pointer"
                                        >
                                            เปลี่ยนรูปโปรไฟล์
                                            <input
                                                id="profile-picture"
                                                name="profile-picture"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleUploadProfile}
                                            />
                                        </label>
                                        <p className="mt-2 text-xs text-gray-600">JPG, GIF or PNG. 1MB max.</p>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-lg font-medium text-gray-900">
                                        ชื่อ
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={fname}
                                            onChange={(e) => setName(e.target.value)}
                                            id="first-name"
                                            name="first-name"
                                            type="text"
                                            autoComplete="given-name"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-lg font-medium text-gray-900">
                                        นามสกุล
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={lname}
                                            onChange={(e) => setLname(e.target.value)}
                                            id="last-name"
                                            name="last-name"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="tel" className="block text-lg font-medium text-gray-900">
                                        เบอร์ติดต่อ
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={tel}
                                            onChange={(e) => setTel(e.target.value)}
                                            id="tel"
                                            name="tel"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="addr" className="block text-lg font-medium text-gray-900">
                                        ที่อยู่
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={addr}
                                            onChange={(e) => setAddr(e.target.value)}
                                            id="addr"
                                            name="addr"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="city" className="block text-lg font-medium text-gray-900">
                                        ตำบล
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            id="city"
                                            name="city"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="dis" className="block text-lg font-medium text-gray-900">
                                        อำเภอ
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            id="dis"
                                            name="dis"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="province" className="block text-lg font-medium text-gray-900">
                                        จังหวัด
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            value={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                            id="province"
                                            name="province"
                                            type="text"
                                            autoComplete="family-name"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full sm:w-50 size-11 px-6 rounded-xl bg-[#F8644B] py-2 text-white cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-100"
                                >
                                    บันทึก
                                </button>
                            </div>
                            {(updataSuccess) && <div className="rounded-xl bg-green-50 p-4 mt-5">
                                <div className="flex">
                                    <div className="shrink-0">
                                        <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-lg font-medium text-green-800">แก้ไขข้อมูลส่วนตัวสำเร็จ</p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <div className="-mx-1.5 -my-1.5">
                                            <button
                                                type="button"
                                                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-hidden"
                                            >
                                                <span className="sr-only">ปิด</span>

                                                <XMarkIcon aria-hidden="true" className="size-5 cursor-pointer" onClick={() => setUpdateSuccess(false)} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {(filledData) && <div className="rounded-xl bg-red-50 p-4 mt-5">
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

                                                <XMarkIcon aria-hidden="true" className="size-5 cursor-pointer" onClick={() => setFilledData(false)} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </form>

                    </div>

                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">เปลี่ยนรหัสผ่าน</h2>
                            <p className="mt-1 text-lg text-gray-600">คุณสามารถเปลี่ยนรหัสผ่านของบัญชีของคุณได้ที่นี่</p>
                        </div>

                        <form className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="current-password" className="block text-lg font-medium text-gray-900">
                                        รหัสผ่านปัจจุบัน
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="current-password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            name="current_password"
                                            type="password"
                                            autoComplete="current-password"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="new-password" className="block text-lg font-medium text-gray-900">
                                        รหัสผ่านใหม่
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="new-password"
                                            name="new_password"
                                            type="password"
                                            autoComplete="new-password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="confirm-password" className="block text-lg font-medium text-gray-900">
                                        ยืนยันรหัสผ่าน
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="confirm-password"
                                            name="confirm_password"
                                            value={confirm_password}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            type="password"
                                            autoComplete="new-password"
                                            className="block w-full rounded-xl bg-gray-100 px-3 py-1.5 text-lg text-gray-900 outline-1 -outline-offset-1 outline-gray-200 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-lg"
                                        />
                                    </div>
                                    {(notMacth) && <p className='text-red-600 text-base mt-2'>รหัสผ่านไม่ตรงกัน</p>}
                                </div>
                            </div>

                            <div className="mt-8 flex">
                                <button
                                    type="button"
                                    onClick={handleChangePassword}
                                    className="w-full sm:w-50 size-11 px-6 rounded-xl bg-[#F8644B] py-2 text-white cursor-pointer hover:scale-105 active:scale-100 transition-transform duration-100"
                                >
                                    เปลี่ยนรหัสผ่าน
                                </button>
                            </div>
                            {(updatePWSS) && <div className="rounded-xl bg-green-50 p-4 mt-5">
                                <div className="flex">
                                    <div className="shrink-0">
                                        <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-lg font-medium text-green-800">เปลี่ยนรหัสผ่านสำเร็จ</p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <div className="-mx-1.5 -my-1.5">
                                            <button
                                                type="button"
                                                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-hidden"
                                            >
                                                <span className="sr-only">ปิด</span>

                                                <XMarkIcon aria-hidden="true" className="size-5 cursor-pointer" onClick={() => setPWSS(false)} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {(pwFilled) && <div className="rounded-xl bg-red-50 p-4 mt-5">
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

                                                <XMarkIcon aria-hidden="true" className="size-5 cursor-pointer" onClick={() => setPwFilled(false)} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
export default Settings;