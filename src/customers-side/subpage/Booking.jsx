import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../../context/requestBooking";
import { useAuth } from "../../context/AuthContext";

const Booking = () => {
  const { addBooking } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  // รับข้อมูลแพ็คเกจจาก state ที่ส่งมาจากหน้า PackageDetail
  const packageId = location.state.packageId;
  const packageName = location.state.name;
  const packageUrl = location.state.url;
  const packageDocumentId = location.state.packageDocumentId;
  const { user } = useAuth();

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [tel, setTel] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipcode] = useState("");
  const [district, setDistrict] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();

    // สร้าง object การจองใหม่
    const newBooking = {
      id: Date.now().toString(), // ใช้ timestamp เป็น id
      customerId: user?.documentId,
      fullName: `${fname} ${lname}`,
      tel,
      address,
      city,
      district,
      province,
      zipCode,
      packageId: packageDocumentId,
      packageName,
      packageUrl,
      status: "Pending", // สถานะเริ่มต้น
      // เพิ่มข้อมูลหัวข้อ Package Details (สถานที่ท่องเที่ยว, อาหาร, บริการ)
      packageDetails: [
        { name: "สถานที่ท่องเที่ยว", detail: "เที่ยวชมวัดและพิพิธภัณฑ์" },
        { name: "อาหาร", detail: "อาหารไทยแท้" },
        { name: "บริการ", detail: "รถรับส่งฟรี" },
      ],
    };

    // บันทึกข้อมูลการจองลงใน context
    addBooking(newBooking);
    // เปลี่ยนหน้าไปยัง Status
    navigate("/status");
  };

  return (
    <form onSubmit={handleBooking}>
      <div className="space-y-12 p-15 flex justify-center">
        <div className="grid grid-cols-1 gap-x-40 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              ข้อมูลผู้จองแพ็คเกจ
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              ใช้สำหรับยืนยันตัวตนในการจองแพ็คเกจ
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                ชื่อ
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  onChange={(e) => setFname(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                นามสกุล
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  onChange={(e) => setLname(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="tel"
                className="block text-sm/6 font-medium text-gray-900"
              >
                เบอร์ติดต่อ
              </label>
              <div className="mt-2">
                <input
                  id="tel"
                  name="tel"
                  type="tel"
                  autoComplete="tel"
                  onChange={(e) => setTel(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm/6 font-medium text-gray-900"
              >
                ที่อยู่
              </label>
              <div className="mt-2">
                <input
                  id="street-address"
                  name="street-address"
                  type="text"
                  autoComplete="street-address"
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm/6 font-medium text-gray-900"
              >
                ตำบล
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="district"
                className="block text-sm/6 font-medium text-gray-900"
              >
                อำเภอ
              </label>
              <div className="mt-2">
                <input
                  id="district"
                  name="district"
                  type="text"
                  autoComplete="address-level1"
                  onChange={(e) => setDistrict(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm/6 font-medium text-gray-900"
              >
                จังหวัด
              </label>
              <div className="mt-2">
                <input
                  id="region"
                  name="region"
                  type="text"
                  autoComplete="address-level1"
                  onChange={(e) => setProvince(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm/6 font-medium text-gray-900"
              >
                รหัสไปรษณี
              </label>
              <div className="mt-2">
                <input
                  id="postal-code"
                  name="postal-code"
                  type="text"
                  autoComplete="postal-code"
                  onChange={(e) => setZipcode(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-[#F8644B] sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center pb-12">
        <button
          type="submit"
          className="cursor-pointer flex max-w-50 flex-1 items-center justify-center rounded-md border border-transparent bg-[#F8644B] px-8 py-3 text-lg font-medium text-white hover:bg-[#f84b4b] focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-3xs hover:scale-105 active:scale-100 transition-transform duration-00"
        >
          ยืนยันการจอง
        </button>
      </div>
    </form>
  );
};

export default Booking;