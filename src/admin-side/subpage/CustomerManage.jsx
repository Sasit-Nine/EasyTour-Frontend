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

    // const updateStatus = (id, newStatus, isHistory = false) => {
    //     Modal.confirm({
    //         title: "Confirm Status Change",
    //         content: `Are you sure you want to change the status to "${newStatus}"?`,
    //         okText: "Yes",
    //         cancelText: "No",
    //         onOk: () => {
    //             if (newStatus === "Rejected") {
    //                 if (isHistory) {
    //                     setHistoryRejectingId(id);
    //                     setIsHistoryReasonModalVisible(true);
    //                 } else {
    //                     setRejectingId(id);
    //                     setIsReasonModalVisible(true);
    //                 }
    //             } else {
    //                 if (isHistory) {
    //                     setHistoryBookings((prev) =>
    //                         prev.map((booking) =>
    //                             booking.id === id ? { ...booking, status: newStatus } : booking
    //                         )
    //                     );
    //                 } else {
    //                     setLocalBookings((prev) => {
    //                         const updatedList = prev.filter((booking) => booking.id !== id);
    //                         const changedItem = prev.find((booking) => booking.id === id);
    //                         if (changedItem) {
    //                             setHistoryBookings((prevHistory) => [
    //                                 ...prevHistory,
    //                                 { ...changedItem, status: newStatus },
    //                             ]);
    //                         }
    //                         return updatedList;
    //                     });
    //                 }
    //             }
    //         },
    //     });
    // };

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
                                                <a onClick={() => handleApprove(person.id)} className="text-red-600 hover:text-green-900 cursor-pointer">
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
        </div>

        // <div
        //     style={{
        //         display: "flex",
        //         justifyContent: "center",
        //         alignItems: "center",
        //         minHeight: "100vh",
        //         background: "#f0f2f5",
        //         padding: "20px",
        //     }}
        // >
        //     <Card
        //         style={{
        //             maxWidth: "900px",
        //             width: "100%",
        //             padding: "20px",
        //             borderRadius: "10px",
        //             boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        //         }}
        //     >
        //         <div
        //             style={{
        //                 display: "flex",
        //                 justifyContent: "space-between",
        //                 alignItems: "center",
        //                 marginBottom: "20px",
        //             }}
        //         >
        //             <Title level={2} style={{ margin: 0 }}>
        //                 Customer Booking Management
        //             </Title>
        //             <Button type="primary" onClick={() => setIsHistoryModalVisible(true)}>
        //                 History
        //             </Button>
        //         </div>
        //         <Table columns={columns} dataSource={localBookings} pagination={false} rowKey="id" />
        //     </Card>

        //     <Modal
        //         title="Customer Details"
        //         open={isModalVisible}
        //         onCancel={() => setIsModalVisible(false)}
        //         footer={<Button onClick={() => setIsModalVisible(false)}>Close</Button>}
        //     >
        //         {selectedBooking && (
        //             <div>
        //                 <p>
        //                     <strong>Customer Name:</strong> {selectedBooking.fullName}
        //                 </p>
        //                 <p>
        //                     <strong>Tel:</strong> {selectedBooking.tel}
        //                 </p>
        //                 <p>
        //                     <strong>Address:</strong> {selectedBooking.address}
        //                 </p>
        //                 <p>
        //                     <strong>City:</strong> {selectedBooking.city}
        //                 </p>
        //                 <p>
        //                     <strong>District:</strong> {selectedBooking.district}
        //                 </p>
        //                 <p>
        //                     <strong>Province:</strong> {selectedBooking.province}
        //                 </p>
        //                 <p>
        //                     <strong>Zip Code:</strong> {selectedBooking.zipCode}
        //                 </p>
        //                 <p>
        //                     <strong>Package Name:</strong> {selectedBooking.packageName}
        //                 </p>
        //                 {selectedBooking.packageDetails && selectedBooking.packageDetails.length > 0 && (
        //                     <div>
        //                         <h3>Package Details</h3>
        //                         {selectedBooking.packageDetails.map((detail, index) => (
        //                             <p key={index}>
        //                                 <strong>{detail.name}:</strong> {detail.detail}
        //                             </p>
        //                         ))}
        //                     </div>
        //                 )}
        //                 <p>
        //                     <strong>Status:</strong>{" "}
        //                     <Text style={{ color: getStatusColor(selectedBooking.status) }}>
        //                         {selectedBooking.status}
        //                     </Text>
        //                 </p>
        //                 <p>
        //                     <strong>Payment Status:</strong>{" "}
        //                     <Text style={{ color: getPaymentStatusColor(selectedBooking.paymentStatus) }}>
        //                         {selectedBooking.paymentStatus}
        //                     </Text>
        //                 </p>
        //                 <p>
        //                     <strong>Booking Time:</strong>{" "}
        //                     <Text>{selectedBooking.bookingTime}</Text>
        //                 </p>
        //             </div>
        //         )}
        //     </Modal>

        //     <Modal
        //         title="Booking History"
        //         open={isHistoryModalVisible}
        //         onCancel={() => setIsHistoryModalVisible(false)}
        //         footer={<Button onClick={() => setIsHistoryModalVisible(false)}>Close</Button>}
        //         width={1000}
        //     >
        //         <Table
        //             columns={columns.map((col) =>
        //                 col.key === "status" || col.key === "paymentStatus"
        //                     ? {
        //                         ...col,
        //                         render: (value, record) => (
        //                             <Select
        //                                 value={value}
        //                                 onChange={(newValue) =>
        //                                     col.key === "status"
        //                                         ? updateStatus(record.id, newValue, true)
        //                                         : updatePaymentStatus(record.id, newValue, true)
        //                                 }
        //                                 style={{
        //                                     width: 130,
        //                                     fontWeight: "bold",
        //                                     color: col.key === "status" ? getStatusColor(value) : getPaymentStatusColor(value),
        //                                 }}
        //                             >
        //                                 {col.key === "status" ? (
        //                                     <>
        //                                         <Option value="Pending">
        //                                             <Text style={{ color: "orange" }}>Pending</Text>
        //                                         </Option>
        //                                         <Option value="Approved">
        //                                             <Text style={{ color: "green" }}>Approved</Text>
        //                                         </Option>
        //                                         <Option value="Rejected">
        //                                             <Text style={{ color: "red" }}>Rejected</Text>
        //                                         </Option>
        //                                     </>
        //                                 ) : (
        //                                     <>
        //                                         <Option value="Paid">
        //                                             <Text style={{ color: "green" }}>Paid</Text>
        //                                         </Option>
        //                                         <Option value="Unpaid">
        //                                             <Text style={{ color: "red" }}>Unpaid</Text>
        //                                         </Option>
        //                                     </>
        //                                 )}
        //                             </Select>
        //                         ),
        //                     }
        //                     : col
        //             )}
        //             dataSource={historyBookings}
        //             pagination={false}
        //             rowKey="id"
        //         />
        //     </Modal>

        //     <Modal
        //         title="Rejection Reason"
        //         open={isReasonModalVisible}
        //         onCancel={() => setIsReasonModalVisible(false)}
        //         footer={[
        //             <Button key="cancel" onClick={() => setIsReasonModalVisible(false)}>
        //                 Cancel
        //             </Button>,
        //             <Button key="submit" type="primary" onClick={handleRejection} disabled={!rejectionReason}>
        //                 Submit
        //             </Button>,
        //         ]}
        //     >
        //         <Input.TextArea
        //             rows={4}
        //             value={rejectionReason}
        //             onChange={(e) => setRejectionReason(e.target.value)}
        //             placeholder="Please provide a reason for rejection"
        //         />
        //     </Modal>

        //     <Modal
        //         title="Rejection Reason"
        //         open={isHistoryReasonModalVisible}
        //         onCancel={() => setIsHistoryReasonModalVisible(false)}
        //         footer={[
        //             <Button key="cancel" onClick={() => setIsHistoryReasonModalVisible(false)}>
        //                 Cancel
        //             </Button>,
        //             <Button key="submit" type="primary" onClick={handleHistoryRejection} disabled={!historyRejectionReason}>
        //                 Submit
        //             </Button>,
        //         ]}
        //     >
        //         <Input.TextArea
        //             rows={4}
        //             value={historyRejectionReason}
        //             onChange={(e) => setHistoryRejectionReason(e.target.value)}
        //             placeholder="Please provide a reason for rejection"
        //         />
        //     </Modal>
        // </div>
    );
};

export default CustomerManage;