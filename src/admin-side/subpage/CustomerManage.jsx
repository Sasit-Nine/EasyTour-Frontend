import React, { useState, useEffect } from "react"; 
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_BOOKING, MUTATION_APPROVE } from "../../services/Graphql";
import dayjs from "dayjs";
import ViewDetail from "../components/ViewDetail";
import ConfirmationModal from "../components/ConfirmationModal";
import useFilterCustomer from "../components/FilterCustomer";
import { useSearch } from "../components/AdminLayout";

const CustomerManage = () => {
    const [APPROVE_MUTATION] = useMutation(MUTATION_APPROVE);
    const { searchQuery } = useSearch();
    const { data, loading, error, refetch } = useQuery(QUERY_BOOKING, {
        variables: {
            filters: {
                booking_status: {
                    eq: "pending"
                }
            },
        },
        context: {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        },
    });

    // เพิ่ม state สำหรับ confirmation modal
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmBookingId, setConfirmBookingId] = useState(null);

    // แสดง modal ยืนยันการอนุมัติ
    const showApproveConfirmation = (documentId) => {
        setConfirmAction('approve');
        setConfirmBookingId(documentId);
        setConfirmModalOpen(true);
    };

    // แสดง modal ยืนยันการปฏิเสธ
    const showRejectConfirmation = (documentId) => {
        setConfirmAction('reject');
        setConfirmBookingId(documentId);
        setConfirmModalOpen(true);
    };

    // ดำเนินการหลังจากยืนยัน
    const handleConfirmAction = () => {
        if (confirmAction === 'approve') {
            confirmApprove();
        } else if (confirmAction === 'reject') {
            confirmReject();
        }
        setConfirmModalOpen(false);
    };

    // ฟังก์ชั่นอนุมัติหลังจากยืนยัน
    const confirmApprove = () => {
        APPROVE_MUTATION({
            variables: {
                documentId: confirmBookingId,
                data: {
                    booking_status: "success",
                }
            },
            context: {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                },
            }
        }).then(() => {
            refetch();
        });
    };
    
    // ฟังก์ชั่นปฏิเสธหลังจากยืนยัน
    const confirmReject = () => {
        APPROVE_MUTATION({
            variables: {
                documentId: confirmBookingId,
                data: {
                    booking_status: "failed",
                }
            },
            context: {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`,
                },
            }
        }).then(() => {
            refetch();
        });
    };

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
        const filtered = localBookings.filter((booking) => {
            const customerName = booking.fullName.toLowerCase();
            const packageName = booking.packageName ? booking.packageName.toLowerCase() : '';
            
            return (
                customerName.includes(query) ||
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
                    <h1 className="text-4xl font-medium text-gray-900">จัดการลูกค้า</h1>
                    <p className="mt-2 text-xl text-gray-700">
                        คุณสามารถตรวจสอบและอนุมัติการจองของลูกค้าได้จากหน้านี้
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
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredBookings.map((person, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
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
                                            {person.status === "pending" ? (
                                                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-lg font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                                                    รอการอนุมัติ
                                                </span>
                                            ) : person.status === "success" ? (
                                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-lg font-medium text-green-800 ring-1 ring-green-600/20 ring-inset">
                                                    อนุมัติการจอง
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-lg font-medium text-red-800 ring-1 ring-red-600/20 ring-inset">
                                                    ปฏิเสธการจอง
                                                </span>
                                            )}
                                        </td>
                                        <td className="relative py-5 pr-4 pl-3 text-right text-lg font-medium whitespace-nowrap sm:pr-0">
                                            <div className="flex gap-2 justify-end">
                                                <button 
                                                    onClick={() => showApproveConfirmation(person.id)} 
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-150"
                                                >
                                                    อนุมัติ
                                                </button>
                                                <button 
                                                    onClick={() => showRejectConfirmation(person.id)} 
                                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-150"
                                                >
                                                    ปฏิเสธ
                                                </button>
                                                <button
                                                    onClick={() => showDetails(person)}
                                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F8644B] hover:bg-[#e55b43] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F8644B] transition-colors duration-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    ดูเพิ่มเติม
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modal สำหรับดูรายละเอียด */}
            <ViewDetail
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                booking={selectedBooking}
            />

            {/* Modal ยืนยันการอนุมัติหรือปฏิเสธ */}
            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmAction}
                action={confirmAction}
                title={confirmAction === 'approve' ? 'ยืนยันการอนุมัติ' : 'ยืนยันการปฏิเสธ'}
                message={
                    confirmAction === 'approve'
                        ? 'คุณต้องการยืนยันการอนุมัติการจองนี้ใช่หรือไม่?'
                        : 'คุณต้องการยืนยันการปฏิเสธการจองนี้ใช่หรือไม่?'
                }
            />
        </div>
    );
};

export default CustomerManage;