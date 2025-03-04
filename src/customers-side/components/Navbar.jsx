import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import planeImg from "../../assets/plane.png";
import { QEURY_PROFILE } from "../../services/Graphql";
import { useQuery } from "@apollo/client";
import profile from "../../assets/profile.jpg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const { user, logout } = useAuth();
    console.log(user)
    const { data: urlProfile } = useQuery(QEURY_PROFILE, {
        skip:(!user),
        variables: {
            "documentId": user?.documentId
        },
        context: {
            headers: { 
                Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
            },
        }
    })
    console.log()

    const navigate = useNavigate()
    const handleLogout = () => {
        logout()
        navigate('/')
    }



    return (
        <Disclosure as="nav" className="bg-[#F8644B] shadow-sm">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 py-3">
                <div className="relative flex h-16 justify-between items-center">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:outline-none">
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center space-x-1.5">
                            <img alt="EasyTour" src={planeImg} className="h-8 w-auto" />
                            <p className="text-2xl font-semibold text-white">EasyTour</p>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-3">
                            <Link className="inline-flex items-center px-3 pt-1 text-lg font-light text-white hover:text-gray-200 hover:scale-105 active:scale-100 transition-transform duration-100" to="/">หน้าหลัก</Link>
                            <Link className="inline-flex items-center px-3 pt-1 text-lg font-light text-white hover:text-gray-200 hover:scale-105 active:scale-100 transition-transform duration-100" to="/packages">แพ็กเกจทัวร์</Link>
                        </div>
                    </div>

                    {/* Right Menu */}
                    {(user) ? (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* Profile Dropdown */}
                            <p className="text-white text-lg max-sm:hidden">สวัสดี {user.username}</p>
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-white text-sm focus:ring-offset-2 focus:outline-none border-3 border-white hover:scale-110 active:scale-100 transition-transform duration-200 cursor-pointer">
                                        <img alt="User" src={urlProfile?.usersPermissionsUser?.profile_picture?`${strapiBaseURL}${urlProfile?.usersPermissionsUser?.profile_picture?.url}`:profile} className="size-10 rounded-full" />
                                    </MenuButton>
                                </div>

                                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5">
                                <MenuItem>
                                    <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/settings">จัดการบัญชี</Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/status">สถานะและประวัติการจอง</Link>
                                </MenuItem>
                                    <MenuItem>
                                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-700" onClick={()=>{handleLogout()}}>ออกจากระบบ</button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    ) : (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            {/* Desktop Menu */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-3">
                                <Link className="inline-flex items-center px-3 pt-1 text-lg font-light text-white hover:text-gray-200 hover:scale-105 active:scale-100 transition-transform duration-100" to="/login">เข้าสู่ระบบ</Link>
                                <Link className="inline-flex items-center px-3 pt-1 text-lg font-light text-white hover:text-gray-200 hover:scale-105 active:scale-100 transition-transform duration-100" to="/register">สมัครสมาชิก</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 pt-2 pb-4">
                    <DisclosureButton as="div" className="block border-l-4 border-white bg-white/10 py-2 pr-4 pl-3 text-base font-medium text-white">
                        <Link className="block" to="/">หน้าหลัก</Link> 
                    </DisclosureButton>
                    <DisclosureButton as="div" className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-white hover:bg-white/20">
                        <Link className="block" to="/packages">แพ็กเกจทัวร์</Link>
                    </DisclosureButton>
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
};

export default Navbar;
