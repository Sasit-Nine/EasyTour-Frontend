import { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Typography, Card } from "antd";
import { useBooking } from "../../context/requestBooking"; // รับข้อมูลจองจาก Context

const { Option } = Select;
const { Title, Text } = Typography;

const CustomerManage = () => {
    const { bookings } = useBooking(); // รับข้อมูลจองจาก Context
    const [localBookings, setLocalBookings] = useState(bookings);
    const [historyBookings, setHistoryBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

    useEffect(() => {
        setLocalBookings(bookings); // อัปเดตเมื่อมีการจองใหม่
    }, [bookings]);

    const updateStatus = (id, newStatus, isHistory = false) => {
        Modal.confirm({
            title: "Confirm Status Change",
            content: `Are you sure you want to change the status to "${newStatus}"?`,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                if (isHistory) {
                    setHistoryBookings((prev) =>
                        prev.map((booking) => booking.id === id ? { ...booking, status: newStatus } : booking)
                    );
                } else {
                    setLocalBookings((prev) => {
                        const updatedList = prev.filter((booking) => booking.id !== id);
                        const changedItem = prev.find((booking) => booking.id === id);
                        if (changedItem) {
                            setHistoryBookings((prevHistory) => [...prevHistory, { ...changedItem, status: newStatus }]);
                        }
                        return updatedList;
                    });
                }
            },
        });
    };

    const showDetails = (record) => {
        setSelectedBooking(record);
        setIsModalVisible(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Approved": return "green";
            case "Pending": return "orange";
            case "Rejected": return "red";
            default: return "black";
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" },
        { title: "Customer Name", dataIndex: "name", key: "name" },
        { title: "Package", dataIndex: "package", key: "package" },
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
                    <Option value="Pending"><Text style={{ color: "orange" }}>Pending</Text></Option>
                    <Option value="Approved"><Text style={{ color: "green" }}>Approved</Text></Option>
                    <Option value="Rejected"><Text style={{ color: "red" }}>Rejected</Text></Option>
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5", padding: "20px" }}>
            <Card style={{ maxWidth: "900px", width: "100%", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <Title level={2} style={{ margin: 0 }}>Customer Booking Management</Title>
                    <Button type="primary" onClick={() => setIsHistoryModalVisible(true)}>History</Button>
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
                        <p><strong>มากี่คน:</strong> {selectedBooking.package}</p>
                        <p><strong>จองกี่วัน:</strong> {selectedBooking.package}</p>
                        <p><strong>มากี่โมง:</strong> {selectedBooking.package}</p>
                        <p><strong>ไปที่ไหน:</strong> {selectedBooking.package}</p>
                        <p><strong>Status:</strong> <Text style={{ color: getStatusColor(selectedBooking.status) }}>{selectedBooking.status}</Text></p>
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
                        col.key === "status"
                            ? { ...col, render: (status, record) => (
                                <Select
                                    value={status}
                                    onChange={(value) => updateStatus(record.id, value, true)}
                                    style={{ width: 130, fontWeight: "bold", color: getStatusColor(status) }}
                                >
                                    <Option value="Pending"><Text style={{ color: "orange" }}>Pending</Text></Option>
                                    <Option value="Approved"><Text style={{ color: "green" }}>Approved</Text></Option>
                                    <Option value="Rejected"><Text style={{ color: "red" }}>Rejected</Text></Option>
                                </Select>
                            ) }
                            : col
                    )}
                    dataSource={historyBookings}
                    pagination={false}
                    rowKey="id"
                />
            </Modal>
        </div>
    );
};

export default CustomerManage;