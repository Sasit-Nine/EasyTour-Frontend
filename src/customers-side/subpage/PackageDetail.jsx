import { data, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PACKAGE, MUTATION_BOOKING } from "../../services/Graphql";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { MapPin, Clock11, CalendarHeart, Users } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@apollo/client";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
const PackageDetail = () => {
    const location = useLocation()
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [pathname])
    // Data User
    const { user } = useAuth()
    // ทำ Combobox
    const [query, setQuery] = useState('')
    const [selectedTour, setSelectedTour] = useState(null)

    const [quantity, setQuantity] = useState(1)
    const navigate = useNavigate()
    const package_id = location.state?.pkgID

    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const { documentId } = useParams()
    console.log(documentId)
    // fetch DataPackage
    const { data: dataPackage, loading: loadingPackage, error: errorPackage } = useQuery(QUERY_PACKAGE, {
        variables: {
            documentId: documentId
        }
    })
    let DataTimeTour = null
    // useEffect(() => {
    //     if (DataTimeTour) {
    //         setSelectedTour(DataTimeTour[0])
    //         console.log(uniqueDataTimeTour)
    //     }
    // }, [DataTimeTour]);
    if (loadingPackage) {
        return <p>Loading</p>
    }
    if (errorPackage) {
        console.error("GraphQL Error:", errorPackage)
    }
    console.log(dataPackage)
    DataTimeTour = dataPackage?.package?.timetables
    const uniqueDataTimeTour = Array.from(new Map(DataTimeTour.map(time => [time.documentId, time])).values())
    console.log(uniqueDataTimeTour)

    dayjs.extend(customParseFormat)
    const time = dataPackage.package.time;
    const formattedTime = dayjs(time, 'HH:mm:ss.SSS').format('HH:mm')


    const handleBooking = async () => {
        console.log(user?.documentId)
        console.log(documentId)
        console.log(package_id)
        console.log(selectedTour.documentId)
        navigate('/booking', {
            state: {
                packageId: package_id,
                packageDocumentId: documentId,
                name: dataPackage?.package?.name,
                url: `${strapiBaseURL}${dataPackage.package.thumbnail.url}`,
                quantity: quantity,
                price: dataPackage.package.price,
                timetable: selectedTour.documentId
            }
        })
    }

    const handleLogin = async () => {
        navigate('/login')
    }



    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        {/* Image gallery */}
                        <TabGroup className="flex flex-col-reverse">
                            {/* Image selector */}
                            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                                <TabList className="grid grid-cols-4 gap-6">
                                    {dataPackage.package.image.map((image, index) => (
                                        <Tab
                                            key={index}
                                            className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-[#F8644B]/50 focus:ring-offset-4 focus:outline-hidden"
                                        >
                                            <span className="absolute inset-0 overflow-hidden rounded-md">
                                                <img alt="" src={`${strapiBaseURL}${image.url}`} className="size-full object-cover" />
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-[#F8644B]"
                                            />
                                        </Tab>
                                    ))}
                                </TabList>
                            </div>

                            <TabPanels>
                                {dataPackage.package.image.map((image, index) => (
                                    <TabPanel key={index}>
                                        <img src={`${strapiBaseURL}${image.url}`} className="aspect-square w-full object-cover sm:rounded-lg" />
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </TabGroup>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-3">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{dataPackage.package.name}</h1>
                            {/* Reviews */}
                            <div className="mt-5">
                                <div className="mb-2.5 flex items-center space-x-1.5 text-base mt-6">
                                    <MapPin className="text-[#F8644B]"></MapPin>
                                    <p>จุดนัดพบ : {dataPackage.package.meeting_point}</p>
                                </div>
                                <div className="mb-2.5 flex items-center space-x-1.5 text-base">
                                    <Users className="text-[#F8644B]"></Users>
                                    <p className="font-medium text-green-700">ที่นั่งว่าง : {dataPackage.package.max_people} คน</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h3 className="sr-only">Description</h3>
                                <p className="text-bold font-medium text-gray-900">คำอธิบายแพ็คเกจทัวร์</p>
                                <div
                                    dangerouslySetInnerHTML={{ __html: dataPackage.package.description }}
                                    className="space-y-6 text-lg text-gray-700"
                                />
                            </div>
                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-5xl tracking-tight text-[#f84b4b] font-extrabold">{new Intl.NumberFormat("en-US").format(dataPackage.package.price * quantity)} ฿</p>
                            </div>
                            <div className="mt-5">
                                <Combobox
                                    as="div"
                                    value={selectedTour}
                                    onChange={(DataTimeTour) => {
                                        setQuery('')
                                        setSelectedTour(DataTimeTour)
                                    }}
                                >
                                    <Label className="block text-base font-medium text-gray-900">เลือกเวลาและวันที่</Label>
                                    <div className="relative mt-2">
                                        <ComboboxInput
                                            className="size-11 block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#f84b4b] sm:text-sm/6"
                                            onChange={(event) => setQuery(event.target.value)}
                                            onBlur={() => setQuery('')}
                                            displayValue={(selectedTour) =>
                                                selectedTour
                                                    ? `${dayjs(selectedTour.start).format('DD-MM-YYYY HH:mm')} - ${dayjs(selectedTour.end).format('DD-MM-YYYY HH:mm')}`
                                                    : ''
                                            }
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
                                            <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
                                        </ComboboxButton>

                                        {DataTimeTour.length > 0 && (
                                            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm">
                                                {uniqueDataTimeTour.map((DataTimeTour, index) => (
                                                    <ComboboxOption
                                                        key={index}
                                                        value={DataTimeTour}
                                                        className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-[#f84b4b] data-focus:text-white data-focus:outline-hidden"
                                                    >
                                                        <div className="flex">
                                                            <span className="truncate group-data-selected:font-semibold">
                                                                {dayjs(DataTimeTour.start).format('DD-MM-YYYY HH:mm')} - {dayjs(DataTimeTour.end).format('DD-MM-YYYY HH:mm')}
                                                            </span>
                                                        </div>

                                                        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-[#f84b4b] group-data-focus:text-white group-data-selected:flex">
                                                            <CheckIcon className="size-5" aria-hidden="true" />
                                                        </span>
                                                    </ComboboxOption>
                                                ))}
                                            </ComboboxOptions>
                                        )}
                                    </div>
                                </Combobox>
                            </div>

                            <form className="mt-6">

                                <div className="mt-10 flex">

                                    <div className="border-2 w-20 mr-3 rounded-xl border-[#f84b4b] flex items-center justify-center gap-1">
                                        <button className="text-gray-500" onClick={(e) => { e.preventDefault(); setQuantity(prev => Math.max(1, prev - 1)) }}>-</button>
                                        <div className="items-center justify-center flex flex-col">
                                            <p className="text-gray-900 text-xs/2">Trav.</p>
                                            <p className="text-lg">{quantity}</p>
                                        </div>
                                        <button className="text-gray-500" onClick={(e) => { e.preventDefault(); setQuantity(quantity + 1) }}>+</button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => (user) ? handleBooking() : handleLogin()}
                                        className="cursor-pointer flex max-w-xs flex-1 items-center justify-center rounded-xl border border-transparent bg-[#F8644B] px-8 py-3 text-lg font-medium text-white hover:bg-[#f84b4b] focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-full hover:scale-105 active:scale-100 transition-transform duration-00"
                                    >
                                        จองเลย
                                    </button>

                                    <button
                                        type="button"
                                        className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                    >
                                        <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
                                        <span className="sr-only">Add to favorites</span>
                                    </button>
                                </div>
                            </form>

                            <section aria-labelledby="details-heading" className="mt-12">
                                <h2 id="details-heading" className="sr-only">
                                    Additional details
                                </h2>

                                <div className="divide-y divide-gray-200 border-t">
                                    <Disclosure as="div">
                                        <h3>
                                            <DisclosureButton className="cursor-pointer group relative flex w-full items-center justify-between py-6 text-left">
                                                <span className="text-base font-medium text-gray-900 group-data-open:text-[#f84b4b]">
                                                    ที่พัก
                                                </span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon
                                                        aria-hidden="true"
                                                        className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                                                    />
                                                    <MinusIcon
                                                        aria-hidden="true"
                                                        className="hidden size-6 text-[#f84b4b]/90 group-hover:text-[#f84b4b] group-data-open:block"
                                                    />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pb-6">
                                            <ul role="list" className="list-disc space-y-1 pl-5 text-base text-gray-700 marker:text-gray-300">
                                                <p>{dataPackage.package.detail.accommodation}</p>
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                    <Disclosure as="div">
                                        <h3>
                                            <DisclosureButton className="cursor-pointer group relative flex w-full items-center justify-between py-6 text-left">
                                                <span className="text-base font-medium text-gray-900 group-data-open:text-[#f84b4b]">
                                                    ราคานี้รวมอะไรบ้าง?
                                                </span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon
                                                        aria-hidden="true"
                                                        className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                                                    />
                                                    <MinusIcon
                                                        aria-hidden="true"
                                                        className="hidden size-6 text-[#f84b4b]/90 group-hover:text-[#f84b4b] group-data-open:block"
                                                    />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pb-6">
                                            <ul role="list" className="list-disc space-y-1 pl-5 text-base text-gray-700 marker:text-gray-300">
                                                <p>{dataPackage.package.detail.price_includes}</p>
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                    <Disclosure as="div">
                                        <h3>
                                            <DisclosureButton className="cursor-pointer group relative flex w-full items-center justify-between py-6 text-left">
                                                <span className="text-base font-medium text-gray-900 group-data-open:text-[#f84b4b]">
                                                    สถานที่ท่องเที่ยว
                                                </span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon
                                                        aria-hidden="true"
                                                        className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-open:hidden"
                                                    />
                                                    <MinusIcon
                                                        aria-hidden="true"
                                                        className="hidden size-6 text-[#f84b4b]/90 group-hover:text-[#f84b4b] group-data-open:block"
                                                    />
                                                </span>
                                            </DisclosureButton>
                                        </h3>
                                        <DisclosurePanel className="pb-6">
                                            <ul role="list" className="list-disc space-y-1 pl-5 text-base text-gray-700 marker:text-gray-300">
                                                <p>{dataPackage.package.detail.tourist_attraction}</p>
                                            </ul>
                                        </DisclosurePanel>
                                    </Disclosure>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

        </motion.div>
    )
};
export default PackageDetail;
