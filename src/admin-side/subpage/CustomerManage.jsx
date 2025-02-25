import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Typography, Card, Input } from "antd";
import { useQuery } from "@apollo/client";
import { QUERY_BOOKING } from "../../services/Graphql";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

const CustomerManage = () => {
    const { data, loading, error } = useQuery(QUERY_BOOKING, {
        variables: {
            filters: {},
        },
        context: {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        },
    });

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
            const transformedBookings = data.bookings.map((bk, index) => ({
                id: bk.documentId || index,
                fullName: `${bk.fname} ${bk.lname}`,
                packageName: bk.package?.name,
                tel: bk.tel,
                address: bk.address,
                city: bk.city,
                district: bk.district,
                province: bk.province,
                zipCode: bk.zipCode,
                packageDetails: bk.packageDetails,
                total_price: bk.total_price,
                quantity: bk.quantity,
                status:
                    bk.booking_status === "pending"
                        ? "Pending"
                        : bk.booking_status === "success"
                            ? "Approved"
                            : "Rejected",
                paymentStatus: bk.payment_status,
                date: dayjs(bk.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
            }));
            setLocalBookings(transformedBookings);
        }
    }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const updateStatus = (id, newStatus, isHistory = false) => {
        Modal.confirm({
            title: "Confirm Status Change",
            content: `Are you sure you want to change the status to "${newStatus}"?`,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                if (newStatus === "Rejected") {
                    if (isHistory) {
                        setHistoryRejectingId(id);
                        setIsHistoryReasonModalVisible(true);
                    } else {
                        setRejectingId(id);
                        setIsReasonModalVisible(true);
                    }
                } else {
                    if (isHistory) {
                        setHistoryBookings((prev) =>
                            prev.map((booking) =>
                                booking.id === id ? { ...booking, status: newStatus } : booking
                            )
                        );
                    } else {
                        setLocalBookings((prev) => {
                            const updatedList = prev.filter((booking) => booking.id !== id);
                            const changedItem = prev.find((booking) => booking.id === id);
                            if (changedItem) {
                                setHistoryBookings((prevHistory) => [
                                    ...prevHistory,
                                    { ...changedItem, status: newStatus },
                                ]);
                            }
                            return updatedList;
                        });
                    }
                }
            },
        });
    };

    const updatePaymentStatus = (id, newStatus, isHistory = false) => {
        if (isHistory) {
            setHistoryBookings((prev) =>
                prev.map((booking) =>
                    booking.id === id ? { ...booking, paymentStatus: newStatus } : booking
                )
            );
        } else {
            setLocalBookings((prev) =>
                prev.map((booking) =>
                    booking.id === id ? { ...booking, paymentStatus: newStatus } : booking
                )
            );
        }
    };

    const handleRejection = () => {
        setLocalBookings((prev) => {
            const updatedList = prev.filter((booking) => booking.id !== rejectingId);
            const changedItem = prev.find((booking) => booking.id === rejectingId);
            if (changedItem) {
                setHistoryBookings((prevHistory) => [
                    ...prevHistory,
                    { ...changedItem, status: "Rejected", reason: rejectionReason },
                ]);
            }
            return updatedList;
        });
        setIsReasonModalVisible(false);
        setRejectionReason("");
    };

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
        setSelectedBooking(record);
        setIsModalVisible(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "green";
            case "Pending":
                return "orange";
            case "Rejected":
                return "red";
            default:
                return "black";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "Paid":
                return "green";
            case "Unpaid":
                return "red";
            default:
                return "black";
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" },
        { title: "Customer Name", dataIndex: "fullName", key: "fullName" },
        { title: "Package", dataIndex: "packageName", key: "packageName" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => updateStatus(record.id, value)}
                    style={{ width: 130, fontWeight: "bold", color: getStatusColor(status) }}
                >
                    <Option value="Pending">
                        <Text style={{ color: "orange" }}>Pending</Text>
                    </Option>
                    <Option value="Approved">
                        <Text style={{ color: "green" }}>Approved</Text>
                    </Option>
                    <Option value="Rejected">
                        <Text style={{ color: "red" }}>Rejected</Text>
                    </Option>
                </Select>
            ),
        },
        {
            title: "Payment Status",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (paymentStatus, record) => (
                <Select
                    value={paymentStatus}
                    onChange={(value) => updatePaymentStatus(record.id, value)}
                    style={{ width: 130, fontWeight: "bold", color: getPaymentStatusColor(paymentStatus) }}
                >
                    <Option value="Paid">
                        <Text style={{ color: "green" }}>Paid</Text>
                    </Option>
                    <Option value="Unpaid">
                        <Text style={{ color: "red" }}>Unpaid</Text>
                    </Option>
                </Select>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_, record) => (
                <Button type="primary" onClick={() => showDetails(record)}>
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "#f0f2f5",
                padding: "20px",
            }}
        >
            <Card
                style={{
                    maxWidth: "900px",
                    width: "100%",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <Title level={2} style={{ margin: 0 }}>
                        Customer Booking Management
                    </Title>
                    <Button type="primary" onClick={() => setIsHistoryModalVisible(true)}>
                        History
                    </Button>
                </div>
                <Table columns={columns} dataSource={localBookings} pagination={false} rowKey="id" />
            </Card>

            <Modal
                title="Customer Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={<Button onClick={() => setIsModalVisible(false)}>Close</Button>}
            >
                {selectedBooking && (
                    <div>
                        <p>
                            <strong>Customer Name:</strong> {selectedBooking.fullName}
                        </p>
                        <p>
                            <strong>Tel:</strong> {selectedBooking.tel}
                        </p>
                        <p>
                            <strong>Address:</strong> {selectedBooking.address}
                        </p>
                        <p>
                            <strong>City:</strong> {selectedBooking.city}
                        </p>
                        <p>
                            <strong>District:</strong> {selectedBooking.district}
                        </p>
                        <p>
                            <strong>Province:</strong> {selectedBooking.province}
                        </p>
                        <p>
                            <strong>Zip Code:</strong> {selectedBooking.zipCode}
                        </p>
                        <p>
                            <strong>Package Name:</strong> {selectedBooking.packageName}
                        </p>
                        {selectedBooking.packageDetails && selectedBooking.packageDetails.length > 0 && (
                            <div>
                                <h3>Package Details</h3>
                                {selectedBooking.packageDetails.map((detail, index) => (
                                    <p key={index}>
                                        <strong>{detail.name}:</strong> {detail.detail}
                                    </p>
                                ))}
                            </div>
                        )}
                        <p>
                            <strong>Status:</strong>{" "}
                            <Text style={{ color: getStatusColor(selectedBooking.status) }}>
                                {selectedBooking.status}
                            </Text>
                        </p>
                        <p>
                            <strong>Payment Status:</strong>{" "}
                            <Text style={{ color: getPaymentStatusColor(selectedBooking.paymentStatus) }}>
                                {selectedBooking.paymentStatus}
                            </Text>
                        </p>
                    </div>
                )}
            </Modal>

            <Modal
                title="Booking History"
                open={isHistoryModalVisible}
                onCancel={() => setIsHistoryModalVisible(false)}
                footer={<Button onClick={() => setIsHistoryModalVisible(false)}>Close</Button>}
                width={1000}
            >
                <Table
                    columns={columns.map((col) =>
                        col.key === "status" || col.key === "paymentStatus"
                            ? {
                                ...col,
                                render: (value, record) => (
                                    <Select
                                        value={value}
                                        onChange={(newValue) =>
                                            col.key === "status"
                                                ? updateStatus(record.id, newValue, true)
                                                : updatePaymentStatus(record.id, newValue, true)
                                        }
                                        style={{
                                            width: 130,
                                            fontWeight: "bold",
                                            color: col.key === "status" ? getStatusColor(value) : getPaymentStatusColor(value),
                                        }}
                                    >
                                        {col.key === "status" ? (
                                            <>
                                                <Option value="Pending">
                                                    <Text style={{ color: "orange" }}>Pending</Text>
                                                </Option>
                                                <Option value="Approved">
                                                    <Text style={{ color: "green" }}>Approved</Text>
                                                </Option>
                                                <Option value="Rejected">
                                                    <Text style={{ color: "red" }}>Rejected</Text>
                                                </Option>
                                            </>
                                        ) : (
                                            <>
                                                <Option value="Paid">
                                                    <Text style={{ color: "green" }}>Paid</Text>
                                                </Option>
                                                <Option value="Unpaid">
                                                    <Text style={{ color: "red" }}>Unpaid</Text>
                                                </Option>
                                            </>
                                        )}
                                    </Select>
                                ),
                            }
                            : col
                    )}
                    dataSource={historyBookings}
                    pagination={false}
                    rowKey="id"
                />
            </Modal>

            <Modal
                title="Rejection Reason"
                open={isReasonModalVisible}
                onCancel={() => setIsReasonModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsReasonModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleRejection} disabled={!rejectionReason}>
                        Submit
                    </Button>,
                ]}
            >
                <Input.TextArea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection"
                />
            </Modal>

            <Modal
                title="Rejection Reason"
                open={isHistoryReasonModalVisible}
                onCancel={() => setIsHistoryReasonModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsHistoryReasonModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleHistoryRejection} disabled={!historyRejectionReason}>
                        Submit
                    </Button>,
                ]}
            >
                <Input.TextArea
                    rows={4}
                    value={historyRejectionReason}
                    onChange={(e) => setHistoryRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection"
                />
            </Modal>
        </div>
    );
};

export default CustomerManage;