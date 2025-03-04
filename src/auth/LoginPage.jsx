import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import krabi_pic from "../assets/evan-krause-BU6lABNbTpA-unsplash.jpg"
import plane from "../assets/plane_orange.png"
import {
    XMarkIcon,
} from '@heroicons/react/24/outline'

export default function Login() {
    const navigate = useNavigate()
    useEffect(() => {
        if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate])

    const [remember, setRemember] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalid, setInvalid] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Username:", username, "Password:", password);
        await login(username, password, remember)
        if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
            navigate('/')
        }else{
            setInvalid(true)
        }
    };
    return (

        <>
            {/*
          This example requires updating your template:
  
          ```
          <html class="h-full bg-white">
          <body class="h-full">
          ```
        */}
            <div className="flex min-h-full">
                <div className="relative w-2/3 hidden lg:block">
                    <img
                        alt=""
                        src={krabi_pic}
                        className="absolute inset-0 size-full object-cover"
                    />
                </div>
                <div className="flex w-full lg:w-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <img
                                alt="Your Company"
                                src={plane}
                                className="h-10 w-auto"
                            />
                            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">เข้าสู่ระบบบัญชีของคุณ</h2>
                            <p className="mt-2 text-base text-gray-500">
                                คุณมีบัญชีหรือยัง ?{' '}
                                <a onClick={()=>navigate('/register')} className="cursor-pointer font-semibold text-[#F8644B]">
                                    สมัครเลย
                                </a>
                            </p>
                        </div>

                        <div className="mt-10">
                            <div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-base font-medium text-gray-900">
                                            ชื่อผู้ใช้
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="username"
                                                name="username"
                                                required
                                                autoComplete="username"
                                                placeholder="ชื่อผู้ใช้"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-base font-medium text-gray-900">
                                            รหัสผ่าน
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="รหัสผ่าน"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                autoComplete="current-password"
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-3">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        id="remember-me"
                                                        name="remember-me"
                                                        checked={remember}
                                                        onChange={() => setRemember(!remember)}
                                                        type="checkbox"
                                                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#F8644B] checked:bg-[#F8644B] indeterminate:border-[#F8644B] indeterminate:bg-[#F8644B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8644B] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                    />
                                                    <svg
                                                        fill="none"
                                                        viewBox="0 0 14 14"
                                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                                    >
                                                        <path
                                                            d="M3 8L6 11L11 3.5"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-checked:opacity-100"
                                                        />
                                                        <path
                                                            d="M3 7H11"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="opacity-0 group-has-indeterminate:opacity-100"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <label htmlFor="remember-me" className="cblock text-base text-gray-900">
                                                จดจำการเข้าสู่ระบบ
                                            </label>
                                        </div>

                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md bg-[#F8644B] px-3 py-1.5 text-base font-semibold text-white shadow-xs hover:scale-110 active:scale-100 transition-transform duration-200 cursor-pointer"
                                        >
                                            เข้าสู่ระบบ
                                        </button>
                                    </div>
                                </form>
                            </div>
                            {(invalid) && <div className="rounded-xl bg-red-50 p-4 mt-5">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-lg font-medium text-red-800">ชื่อผู้ใช้หรือรหัสผ่านผิดพลาด</p>
                                    </div>
                                    <div className="ml-auto pl-3">
                                        <div className="-mx-1.5 -my-1.5">
                                            <button
                                                type="button"
                                                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-green-50 focus:outline-hidden"
                                            >
                                                <span className="sr-only">ปิด</span>

                                                <XMarkIcon aria-hidden="true" className="size-5 cursor-pointer" onClick={() => setInvalid(false)} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                            <div className="mt-10">
                                <div className="relative">
                                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    {/* <div className="relative flex justify-center text-base font-medium">
                                        <span className="bg-white px-6 text-gray-900">หรือเข้าสู่ระบบด้วย</span>
                                    </div> */}
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    {/* <a
                                        href="http://localhost:1337/api/connect/google?redirect=http://localhost:3000"
                                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                            <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                                            <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                                            <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                                            <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                                        </svg>
                                        <span className="text-base font-semibold">Google</span>
                                    </a>


                                    <a
                                        href="#"
                                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 focus-visible:ring-transparent"
                                    >
                                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-[#1877F2]">
                                            <path
                                                d="M22.675 0h-21.35C.597 0 0 .598 0 1.333v21.334C0 23.402.597 24 1.325 24h11.495V14.706h-3.13v-3.637h3.13V8.33c0-3.1 1.893-4.787 4.659-4.787 1.325 0 2.462.099 2.794.143v3.24h-1.918c-1.505 0-1.797.717-1.797 1.767v2.32h3.59l-.468 3.637h-3.122V24h6.117c.728 0 1.325-.598 1.325-1.333V1.333C24 .598 23.403 0 22.675 0z"
                                            />
                                        </svg>
                                        <span className="text-base font-semibold">Facebook</span>
                                    </a> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

