import { data, useParams } from "react-router-dom";
import React from "react";
import { useQuery } from "@apollo/client";
import { QUERY_PACKAGE, MUTATION_BOOKING } from "../../services/Graphql";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { MapPin, Clock11, CalendarHeart, Users } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@apollo/client";
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
    const package_id = location.state?.pkgID

    const navigate = useNavigate()
    const [isBooking, setisBooking] = useState(false)
    const { user } = useAuth()
    const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
    const { documentId } = useParams()
    console.log(documentId)
    const { data: dataPackage, loading: loadingPackage, error: errorPackage } = useQuery(QUERY_PACKAGE, {
        variables: {
            documentId: documentId
        }
    })
    console.log(dataPackage)
    if (loadingPackage) {
        return <p>Loading</p>
    }
    if (errorPackage) {
        return <p>{errorPackage}</p>
    }
    dayjs.extend(customParseFormat)
    const time = dataPackage.package.time;
    const formattedTime = dayjs(time, 'HH:mm:ss.SSS').format('HH:mm')
    const uniquePackageDetails = dataPackage.package.package_details.filter(
        (detail, index, self) =>
            index === self.findIndex((t) => t.name === detail.name && t.detail === detail.detail)
    );


    const handleBooking = async () => {
        // setisBooking(true)
        console.log(user?.documentId)
        console.log(documentId)
        console.log(package_id)
        navigate('/booking', {
            state: {
                packageId: package_id,
                packageDocumentId: documentId,
                name: dataPackage?.package?.name,
                url: `${strapiBaseURL}${dataPackage.package.image[0].url}`
            }
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y:0}}
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
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{dataPackage.package.name}</h1>
                            {/* Reviews */}
                            <div className="mt-3">
                                <h3 className="sr-only">Reviews</h3>
                                <div className="flex items-center">

                                    <div className="flex items-center">
                                        {[0, 1, 2, 3, 4].map((rating) => (
                                            <StarIcon
                                                key={rating}
                                                aria-hidden="true"
                                                className={classNames(
                                                    dataPackage.package.rating > rating ? 'text-[#F8644B]' : 'text-gray-300',
                                                    'size-5 shrink-0',
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <p className="sr-only">{dataPackage.package.rating} out of 5 stars</p>

                                </div>
                                <div className="mb-2.5 flex items-center space-x-1.5 mt-3 text-base">
                                    <CalendarHeart className="text-[#F8644B]"></CalendarHeart>
                                    <p>วันที่ : {dataPackage.package.start} ถึง {dataPackage.package.end} ({dataPackage.package.duration} วัน)</p>
                                </div>
                                <div className="mb-2.5 flex items-center space-x-1.5 text-base">
                                    <MapPin className="text-[#F8644B]"></MapPin>
                                    <p>จุดนัดพบ : {dataPackage.package.meeting_point}</p>
                                </div>
                                <div className="mb-2.5 flex items-center space-x-1.5 text-base">
                                    <Clock11 className="text-[#F8644B]"></Clock11>
                                    <p>เวลานัดพบ : {formattedTime} น.</p>
                                </div>
                                <div className="mb-2.5 flex items-center space-x-1.5 text-base">
                                    <Users className="text-[#F8644B]"></Users>
                                    <p className="font-medium text-green-700">ที่นั่งว่าง : {dataPackage.package.max_people} คน</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h3 className="sr-only">Description</h3>

                                <div
                                    dangerouslySetInnerHTML={{ __html: dataPackage.package.description }}
                                    className="space-y-6 text-lg text-gray-700"
                                />
                            </div>
                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-4xl tracking-tight text-[#f84b4b] font-extrabold">{dataPackage.package.price} ฿</p>
                            </div>

                            <form className="mt-6">

                                <div className="mt-10 flex">
                                    <button
                                        type="button"
                                        onClick={() => handleBooking()}
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
                                    {uniquePackageDetails.map((detail) => (
                                        <Disclosure key={detail.name} as="div">
                                            <h3>
                                                <DisclosureButton className="cursor-pointer group relative flex w-full items-center justify-between py-6 text-left">
                                                    <span className="text-base font-medium text-gray-900 group-data-open:text-[#f84b4b]">
                                                        {detail.name}
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
                                                    <p>{detail.detail}</p>
                                                </ul>
                                            </DisclosurePanel>
                                        </Disclosure>
                                    ))}
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

