import { useState } from "react";
import { Table, Select, Button, Modal, Typography, Card } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const CustomerManage = () => {
    const [bookings, setBookings] = useState([
        { id: 1, name: "Pratya", package: "น้ำตกทรายขาว", status: "Pending" },
        { id: 2, name: "Sasit", package: "วัดทรายขาว", status: "Pending" },
        { id: 3, name: "Weeraphat", package: "หาดทรายขาว", status: "Pending" },
    ]);

    const [approvedBookings, setApprovedBookings] = useState([]); // เก็บข้อมูลที่ Approved
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false); // State ของ History Modal

    const updateStatus = (id, newStatus) => {
        Modal.confirm({
            title: "Confirm Status Change",
            content: `Are you sure you want to change the status to "${newStatus}"?`,
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                setBookings((prev) => {
                    const updatedList = prev.filter((booking) => booking.id !== id);
                    const approvedItem = prev.find((booking) => booking.id === id);
                    
                    if (approvedItem && newStatus === "Approved") {
                        setApprovedBookings((prevApproved) => [...prevApproved, { ...approvedItem, status: newStatus }]);
                    }
                    
                    return updatedList;
                });
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

    const historyColumns = [
        { title: "ID", dataIndex: "id", key: "id", align: "center" },
        { title: "Customer Name", dataIndex: "name", key: "name" },
        { title: "Package", dataIndex: "package", key: "package" },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Text style={{ color: getStatusColor(status), fontWeight: "bold" }}>
                    {status}
                </Text>
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
                <Table columns={columns} dataSource={bookings} pagination={false} rowKey="id" />
            </Card>

            {/* Modal แสดงรายละเอียดลูกค้า */}
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

            {/* Modal แสดง History */}
            <Modal
                title="Approved History"
                open={isHistoryModalVisible}
                onCancel={() => setIsHistoryModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsHistoryModalVisible(false)}>
                        Close
                    </Button>,
                ]}
            >
                <Table
                    columns={historyColumns}
                    dataSource={approvedBookings}
                    pagination={false}
                    rowKey="id"
                />
            </Modal>
        </div>
    );
};
//
export default CustomerManage;
