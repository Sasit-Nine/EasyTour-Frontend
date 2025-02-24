import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Typography, Card } from "antd";
import { useQuery } from "@apollo/client";
import { QUERY_BOOKING } from "../../services/Graphql";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

const CustomerManage = () => {
  // ใช้ useQuery เพื่อดึงข้อมูลการจอง (เหมือนในหน้า Status)
  const { data, loading, error } = useQuery(QUERY_BOOKING, {
    variables: {
      // กำหนดตัวกรองได้ตามต้องการ เช่น filter by customer username
      filters: {
        // ตัวอย่างการกรอง หากต้องการกรองตาม username ของผู้ใช้
        // customers: { username: { eq: "exampleUsername" } }
      },
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

  // เมื่อข้อมูลจาก GraphQL เปลี่ยน ให้แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
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
        // สมมติว่า booking มี packageDetails ในรูปแบบ array เช่น:
        // [{ name: "สถานที่ท่องเที่ยว", detail: "เที่ยวชมวัดและพิพิธภัณฑ์" }, ...]
        packageDetails: bk.packageDetails,
        total_price: bk.total_price,
        quantity: bk.quantity,
        // แปลงสถานะจาก GraphQL ให้เป็นคำที่อ่านง่าย
        status:
          bk.booking_status === "pending"
            ? "Pending"
            : bk.booking_status === "success"
            ? "Approved"
            : "Rejected",
        date: dayjs(bk.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
      }));
      setLocalBookings(transformedBookings);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // ฟังก์ชันอัปเดตสถานะการจอง
  const updateStatus = (id, newStatus, isHistory = false) => {
    Modal.confirm({
      title: "Confirm Status Change",
      content: `Are you sure you want to change the status to "${newStatus}"?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
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
      },
    });
  };

  // ฟังก์ชันแสดงรายละเอียดการจองใน Modal
  const showDetails = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  // กำหนดสีของสถานะ
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

  // กำหนด columns สำหรับตารางให้ตรงกับรูปแบบข้อมูลที่ transform แล้ว
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

      {/* Modal สำหรับดูรายละเอียดการจอง */}
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
          </div>
        )}
      </Modal>

      {/* Modal สำหรับดูประวัติการเปลี่ยนแปลงสถานะ */}
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
              ? {
                  ...col,
                  render: (status, record) => (
                    <Select
                      value={status}
                      onChange={(value) => updateStatus(record.id, value, true)}
                      style={{
                        width: 130,
                        fontWeight: "bold",
                        color: getStatusColor(status),
                      }}
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
                }
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
