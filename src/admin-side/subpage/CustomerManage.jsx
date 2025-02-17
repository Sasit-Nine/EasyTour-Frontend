import { useState } from "react";
import { Table, Select, Button, Modal, Typography, Card } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const CustomerManage = () => {
    const [bookings, setBookings] = useState([
        { id: 1, name: "Pratya", package: "น้ำตกทรายขาว", status: "Pending" },
        { id: 2, name: "Sasit", package: "วัดทรายขาว", status: "Pending" },
        { id: 3, name: "Weeraphat", package: "หาดทรายขาว", status: "Approved" },
    ]);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const updateStatus = (id, status) => {
        setBookings((prev) =>
            prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
        );
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
                        width: 130,
                        fontWeight: "bold",
                        color: getStatusColor(status),
                    }}
                    optionLabelProp="label"
                >
                    <Option value="Pending" label={<Text style={{ color: "orange" }}>Pending</Text>}>
                        <Text style={{ color: "orange" }}>Pending</Text>
                    </Option>
                    <Option value="Approved" label={<Text style={{ color: "green" }}>Approved</Text>}>
                        <Text style={{ color: "green" }}>Approved</Text>
                    </Option>
                    <Option value="Rejected" label={<Text style={{ color: "red" }}>Rejected</Text>}>
                        <Text style={{ color: "red" }}>Rejected</Text>
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f0f2f5", padding: "20px" }}>
            <Card style={{ maxWidth: "900px", width: "100%", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>Customer Booking Management</Title>
                <Table columns={columns} dataSource={bookings} pagination={false} rowKey="id" />
            </Card>

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
                        <p><strong>มากี่คน:</strong> -</p>
                        <p><strong>จองกี่วัน:</strong> -</p>
                        <p><strong>มากี่โมง:</strong> -</p>
                        <p><strong>ไปที่ไหน:</strong> {selectedBooking.package}</p>
                        <p><strong>Status:</strong> <Text style={{ color: getStatusColor(selectedBooking.status) }}>{selectedBooking.status}</Text></p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomerManage;
