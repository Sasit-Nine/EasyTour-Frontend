import { useState } from "react";
import { Table, Select, Button, Modal } from "antd";

const { Option } = Select;

const CustomerManage = () => {
    const [bookings, setBookings] = useState([
        { id: 1, name: "Pratya", package: "น้ำตกทรายขาว", status: "Pending" },
        { id: 2, name: "Sasit", package: "วัดทรายขาว", status: "Pending" },
        { id: 3, name: "Weeraphat", package: "หาดทรายขาว", status: "Approved" },
    ]);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const updateStatus = (id, newStatus) => {
        Modal.confirm({
            title: "Confirm Status Change",
            content: `Are you sure you want to change the status to "${newStatus}"?`,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                setBookings((prev) =>
                    prev.map((booking) =>
                        booking.id === id ? { ...booking, status: newStatus } : booking
                    )
                );
            },
        });
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
                    style={{
                        width: 120,
                        fontWeight: "bold",
                        color: getStatusColor(status),
                    }}
                >
                    <Option value="Pending" style={{ color: "orange" }}>Pending</Option>
                    <Option value="Approved" style={{ color: "green" }}>Approved</Option>
                    <Option value="Rejected" style={{ color: "red" }}>Rejected</Option>
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f5f5", padding: "20px" }}>
            <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "100%", maxWidth: "800px" }}>
                <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>Customer Booking Management</h1>
                <Table columns={columns} dataSource={bookings} pagination={false} rowKey="id" />
            </div>

            <Modal
                title="Customer Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>,
                ]}
            >
                {selectedBooking && (
                    <div>
                        <p><strong>มากี่คน:</strong></p>
                        <p><strong>จองกี่วัน:</strong></p>
                        <p><strong>มากี่โมง:</strong></p>
                        <p><strong>ไปที่ไหน:</strong> </p>
                        <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedBooking.status) }}>{selectedBooking.status}</span></p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerManage;
