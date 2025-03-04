import React, { useState, useEffect } from "react"; 
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_BOOKING, MUTATION_APPROVE } from "../../services/Graphql";
import dayjs from "dayjs";
import ViewDetail from "../components/ViewDetail";
import { useSearch } from "../components/AdminLayout";

const History = () => {
    const [APPROVE_MUTATION] = useMutation(MUTATION_APPROVE);
    const { searchQuery } = useSearch();
    const { data, loading, error, refetch } = useQuery(QUERY_BOOKING, {
        variables: {
            filters: {
                booking_status: {
                    ne: "pending"
                }
            },
        },
        context: {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        },
    });

    const handleRecheck = (documentId) => {
        APPROVE_MUTATION({
            variables: {
                documentId: documentId,
                data: {
                    booking_status: "pending",
                }
            },
            context: {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                },
            }
        }).then(() => {
            refetch()
        })
    }

    const [localBookings, setLocalBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (data && data.bookings) {
            const transformedBookings = data.bookings.map((bk) => ({
                id: bk.documentId,
                fullName: `${bk.fname} ${bk.lname}`,
                packageName: bk.package?.name,
                tel: bk.tel,
                address: bk.address,
                city: bk.city,
                district: bk.district,
                province: bk.province,
                Reciep: bk.payment?.stripe_receipt_url,
                total_price: bk.total_price,
                quantity: bk.quantity,
                status: bk.booking_status,
                paymentStatus: bk.payment?.status_payment || 'ชำระเงินล้มเหลว',
                date: dayjs(bk.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
                bookingTime: dayjs(bk.createdAt).format("DD/MM/YYYY HH:mm:ss"),
            }));
            setLocalBookings(transformedBookings);
            setFilteredBookings(transformedBookings);
        }
    }, [data]);

    // Effect for filtering based on the global search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBookings(localBookings);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = localBookings.filter((booking, index) => {
            //const bookingIndex = (index + 1).toString();
            const customerName = booking.fullName.toLowerCase();
            const packageName = booking.packageName ? booking.packageName.toLowerCase() : '';
            
            return (
                customerName.includes(query) ||
                //bookingIndex.includes(query) ||
                packageName.includes(query)
            );
        });
        
        setFilteredBookings(filtered);
    }, [searchQuery, localBookings]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const showDetails = (record) => {
        setIsModalVisible(true);
        setSelectedBooking(record);
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-4xl font-medium text-gray-900">ประวัติการจอง</h1>
                    <p className="mt-2 text-xl text-gray-700">
                        คุณสามารถตรวจสอบและจัดการประวัติการจองได้จากหน้านี้
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-lg font-semibold text-gray-900 sm:pl-0">
                                        ลำดับการจอง
                                    </th>
                                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-lg font-semibold text-gray-900 sm:pl-0">
                                        ชื่อลูกค้า
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                                        แพ็กเกจที่จอง
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                                        สถานะการชำระเงิน
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-lg font-semibold text-gray-900">
                                        สถานะการอนุมัติการจอง
                                    </th>
                                    <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredBookings.map((person, index) => (
                                    <tr key={index}>
                                        <td className="py-5 pr-3 pl-4 text-lg whitespace-nowrap sm:pl-0">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{index + 1}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 pr-3 pl-4 text-lg whitespace-nowrap sm:pl-0">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{person.fullName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-5 text-lg whitespace-nowrap text-gray-500">
                                            <div className="text-gray-900">{person.packageName}</div>
                                        </td>
                                        <td className="px-3 py-5 text-lg whitespace-nowrap text-gray-500">
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-lg font-normal text-green-700 ring-1 ring-green-600/20 ring-inset">
                                                {person.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-3 py-5 text-lg whitespace-nowrap">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-lg font-normal ring-1 ring-inset ${
                                                person.status === "success" 
                                                    ? "bg-green-50 text-green-700 ring-green-600/20" 
                                                    : "bg-red-50 text-red-700 ring-red-600/20"
                                            }`}>
                                                {person.status === "success" ? "อนุมัติการจอง" : "ปฏิเสธการจอง"}
                                            </span>
                                        </td>
                                        <td className="relative py-5 pr-4 pl-3 text-right text-lg font-medium whitespace-nowrap sm:pr-0">
                                            <div className="flex gap-3">
                                                <a onClick={() => handleRecheck(person.id)} className="text-yellow-500  cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100">
                                                    ตรวจสอบใหม่
                                                </a>
                                                <a onClick={() => showDetails(person)} className="text-[#F8644B] hover:text-[#F8644B] cursor-pointer font-medium hover:scale-105 active:scale-100 transition-transform duration-100">
                                                    ดูเพิ่มเติม
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ViewDetail
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                booking={selectedBooking}
            ></ViewDetail>
        </div>
    );
};

export default History;