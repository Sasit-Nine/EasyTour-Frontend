import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Typography, Card, Input } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { QUERY_BOOKING, MUTATION_APPROVE } from "../../services/Graphql";
import dayjs from "dayjs";
import ViewDetail from "../components/ViewDetail";

const { Option } = Select;
const { Title, Text } = Typography;

const CustomerManage = () => {
    const [APPROVE_MUTATION] = useMutation(MUTATION_APPROVE)
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

    const handleApprove = (documentId) => {
        APPROVE_MUTATION({
            variables: {
                documentId: documentId,
                data: {
                    booking_status: "success",
                }
            },
            context: {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            }
        }).then(() => {
            refetch()
            // Move the approved booking to history
            const approvedBooking = localBookings.find(booking => booking.id === documentId);
            setLocalBookings(localBookings.filter(booking => booking.id !== documentId));
            setHistoryBookings([...historyBookings, { ...approvedBooking, status: "success" }]);
        })
    }
    const handleRejection = (documentId) => {
        APPROVE_MUTATION({
            variables: {
                documentId: documentId,
                data: {
                    booking_status: "failed",
                }
            },
            context: {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            }
        }).then(() => {
            refetch()
            // Move the rejected booking to history
            const rejectedBooking = localBookings.find(booking => booking.id === documentId);
            setLocalBookings(localBookings.filter(booking => booking.id !== documentId));
            setHistoryBookings([...historyBookings, { ...rejectedBooking, status: "failed" }]);
        })
    }

    const [localBookings, setLocalBookings] = useState([]);
    const [historyBookings, setHistoryBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
    const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isHistoryReasonModalVisible, setIsHistoryReasonModalVisible] = useState(false);
    const [historyRejectingId, setHistoryRejectingId] = useState(null);
    const [historyRejectionReason, setHistoryRejectionReason] = useState("");

    useEffect(() => {
        if (data && data.bookings) {
            console.log(data)
            const transformedBookings = data.bookings.map((bk) => ({
                id: bk.documentId,
                fullName: `${bk.fname} ${bk.lname}`,
                packageName: bk.package?.name,
                tel: bk.tel,
                address: bk.address,
                city: bk.city,
                district: bk.district,
                province: bk.province,
                zipCode: bk.zipCode,
                Reciep: bk.payment.stripe_receipt_url,
                total_price: bk.total_price,
                quantity: bk.quantity,
                status: bk.booking_status,
                paymentStatus: bk.payment.status_payment,
                date: dayjs(bk.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
                bookingTime: dayjs(bk.createdAt).format("DD/MM/YYYY HH:mm:ss"),
            }));
            setLocalBookings(transformedBookings);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const handleHistoryRejection = () => {
        setHistoryBookings((prev) =>
            prev.map((booking) =>
                booking.id === historyRejectingId
                    ? { ...booking, status: "Rejected", reason: historyRejectionReason }
                    : booking
            )
        );
        setIsHistoryReasonModalVisible(false);
        setHistoryRejectionReason("");
    };

    const showDetails = (record) => {
        setIsModalVisible(true);
        setSelectedBooking(record);
    };

    console.log(localBookings)
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-medium text-gray-900">จัดการลูกค้า</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                    </p>
                </div>
                {/* Add the History button next to the bell icon */}
                <div className="flex items-center space-x-4">
                    <Button type="primary" onClick={() => setIsHistoryModalVisible(true)}>
                        History
                    </Button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-base font-semibold text-gray-900 sm:pl-0">
                                        ลำดับการจอง
                                    </th>
                                    <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-base font-semibold text-gray-900 sm:pl-0">
                                        ชื่อลูกค้า
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-base font-semibold text-gray-900">
                                        แพ็กเกจที่จอง
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-base font-semibold text-gray-900">
                                        สถานะการชำระเงิน
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-base font-semibold text-gray-900">
                                        สถานะการอนุมัติการจอง
                                    </th>
                                    <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {localBookings.map((person, index) => (
                                    <tr key={index}>
                                        <td className="py-5 pr-3 pl-4 text-base whitespace-nowrap sm:pl-0">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{index + 1}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 pr-3 pl-4 text-base whitespace-nowrap sm:pl-0">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="font-medium text-gray-900">{person.fullName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-5 text-base whitespace-nowrap text-gray-500">
                                            <div className="text-gray-900">{person.packageName}</div>
                                        </td>
                                        <td className="px-3 py-5 text-base whitespace-nowrap text-gray-500">
                                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-base font-normal text-green-700 ring-1 ring-green-600/20 ring-inset">
                                                {person.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-3 py-5 text-base whitespace-nowrap text-gray-500">
                                            {(person.status === "pending") ? 'รอการอนุมัติ' : (person.status === 'success') ? 'อนุมัติการจอง' : 'ปฏิเสธการจอง'}
                                        </td>
                                        <td className="relative py-5 pr-4 pl-3 text-right text-base font-medium whitespace-nowrap sm:pr-0">
                                            <div className="flex gap-3">
                                                <a onClick={() => handleApprove(person.id)} className="text-green-600 hover:text-green-900 cursor-pointer">
                                                    อนุมัติ
                                                </a>
                                                <a onClick={() => handleRejection(person.id)} className="text-red-600 hover:text-red-900 cursor-pointer">
                                                    ปฏิเสธ
                                                </a>
                                                <a onClick={() => showDetails(person)} className="text-[#F8644B] hover:text-[#F8644B] cursor-pointer">
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
            <Modal
                title="Booking History"
                visible={isHistoryModalVisible}
                onCancel={() => setIsHistoryModalVisible(false)}
                footer={<Button onClick={() => setIsHistoryModalVisible(false)}>Close</Button>}
                width={1000}
            >
                <Table
                    columns={[
                        {
                            title: "ลำดับการจอง",
                            dataIndex: "id",
                            key: "id",
                            render: (text, record, index) => <span>{index + 1}</span>
                        },
                        {
                            title: "ชื่อลูกค้า",
                            dataIndex: "fullName",
                            key: "fullName"
                        },
                        {
                            title: "แพ็กเกจที่จอง",
                            dataIndex: "packageName",
                            key: "packageName"
                        },
                        {
                            title: "สถานะการชำระเงิน",
                            dataIndex: "paymentStatus",
                            key: "paymentStatus"
                        },
                        {
                            title: "สถานะการอนุมัติการจอง",
                            dataIndex: "status",
                            key: "status"
                        },
                        {
                            title: "Action",
                            key: "action",
                            render: (text, record) => (
                                <div className="flex gap-3">
                                    <a onClick={() => handleApprove(record.id)} className="text-green-600 hover:text-green-900 cursor-pointer">
                                        อนุมัติ
                                    </a>
                                    <a onClick={() => handleRejection(record.id)} className="text-red-600 hover:text-red-900 cursor-pointer">
                                        ปฏิเสธ
                                    </a>
                                </div>
                            )
                        }
                    ]}
                    dataSource={historyBookings}
                    pagination={false}
                    rowKey="id"
                />
            </Modal>
        </div>
    );
};

export default CustomerManage;