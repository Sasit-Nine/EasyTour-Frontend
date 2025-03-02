import React, { useState } from "react"
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useMutation, useLazyQuery } from "@apollo/client";
import { MUTATION_BOOKING, QEURY_BOOKINGID } from "../../services/Graphql";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Booking = () => {
  const navigate = useNavigate()
  const [BookingMutation] = useMutation(MUTATION_BOOKING)
  const [BookingQuery] = useLazyQuery(QEURY_BOOKINGID)
  const strapiBaseURL = import.meta.env.VITE_STRAPI_URL
  const location = useLocation()
  const packageId = location.state.packageId
  const name = location.state.name
  const url = location.state.url
  const quantity = location.state.quantity
  const price = location.state.price
  const packageDocumentId = location.state.packageDocumentId
  const timetable = location.state.timetable
  const { user } = useAuth();

  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [tel, setTel] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [zipCode, setZipcode] = useState('')
  const [district, setDistrict] = useState('')

  console.log(packageId, packageDocumentId)
  console.log(user?.documentId)

  const handleBooking = async (e) => {
    e.preventDefault();
    console.log(fname, lname, tel, address, city, district, province, zipCode)
    try {
      const { data: BookingData } = await BookingMutation({
        variables: {
          data: {
            customers: user?.documentId,
            package: packageDocumentId,
            fname: fname,
            lname: lname,
            city: city,
            district: district,
            province: province,
            total_price: price * quantity,
            quantity: quantity,
            tel: tel,
            address: address,
            timetable: timetable
          }
        },
        context: {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
          },
        }
      })

      const { data: BookingID } = await BookingQuery({
        variables: {
          documentId: BookingData?.createBooking?.documentId
        },
        context: {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
          },
        }
      })
      const bkID = BookingID?.booking?.booking_id
      console.log(bkID)

      const response = await axios.post(`${strapiBaseURL}/api/payment/checkout`, {
        packageId: packageId,
        BookingId: bkID,
        Quantity: quantity
      })
      console.log('Response:', response.data.url)
      if (response?.data?.url) {
        window.location.href = response.data.url
      } else {
        alert('Error Payment')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form>
      <div className="p-15 flex justify-center items-center">
        <div className="grid grid-cols-1 gap-y-10 border-b border-gray-900/10 pb-12 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">ข้อมูลผู้จองแพ็คเกจ</h2>
            <p className="mt-1 text-lg text-gray-600">ใช้สำหรับยืนยันตัวตนในการจองแพ็คเกจ</p>
            <div className="w-100 mt-3.5 md:w-160 lg:w-150">
              <div className="mt-10 lg:mt-0">

                <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
                  <h3 className="sr-only">Items in your cart</h3>
                  <ul role="list" className="divide-y divide-gray-200">
                    <li className="flex px-4 py-6 sm:px-6">
                      <div className="shrink-0">
                        <img src={`${url}`} className="w-50 rounded-md" />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <a className="font-medium text-2xl text-gray-700 hover:text-gray-800">
                                {name}
                              </a>
                            </h4>
                            <p className="mt-1 text-base text-gray-500">{price} บาท</p>
                            <p className="mt-1 text-base text-gray-500">x {quantity}</p>
                          </div>
                          <div className="ml-4 flow-root shrink-0">
                            <button
                              type="button"
                              className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                            >
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 text-base font-normal text-[#F8644B] cursor-pointer" onClick={()=>{navigate(`/packages/${packageDocumentId}`)}}>ดูแพ็กเกจทัวร์</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-base">ราคาต่อท่าน </dt>
                      <dd className="text-base font-medium text-gray-900">฿{price}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-base">จำนวนนักท่องเที่ยว</dt>
                      <dd className="text-base font-medium text-gray-900">{quantity}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-lg font-medium">ราคารวม</dt>
                      <dd className="text-lg font-medium text-gray-900">{price*quantity}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-1">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-base font-medium text-gray-900">
                ชื่อ
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  onChange={(e) => setFname(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="last-name" className="block text-base font-medium text-gray-900">
                นามสกุล
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  onChange={(e) => setLname(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-base font-medium text-gray-900">
                เบอร์ติดต่อ
              </label>
              <div className="mt-2">
                <input
                  id="tel"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  onChange={(e) => setTel(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-base font-medium text-gray-900">
                ที่อยู่
              </label>
              <div className="mt-2">
                <input
                  id="street-address"
                  name="street-address"
                  type="text"
                  autoComplete="street-address"
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-base font-medium text-gray-900">
                ตำบล
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-base font-medium text-gray-900">
                อำเภอ
              </label>
              <div className="mt-2">
                <input
                  id="district"
                  name="district"
                  type="text"
                  autoComplete="address-level1"
                  onChange={(e) => setDistrict(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-base font-medium text-gray-900">
                จังหวัด
              </label>
              <div className="mt-2">
                <input
                  id="region"
                  name="region"
                  type="text"
                  autoComplete="address-level1"
                  onChange={(e) => setProvince(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#F8644B] sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="flex justify-center pb-12">
        <button type='submit' onClick={handleBooking} className="cursor-pointer flex max-w-50 flex-1 items-center justify-center rounded-md border border-transparent bg-[#F8644B] px-8 py-3 text-lg font-medium text-white hover:bg-[#f84b4b] focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-3xs hover:scale-105 active:scale-100 transition-transform duration-00">ยืนยันการจอง</button>
      </div>

    </form>
  )
};

export default Booking;

