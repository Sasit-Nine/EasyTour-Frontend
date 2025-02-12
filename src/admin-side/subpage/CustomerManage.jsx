import { useState } from "react";
import { Table, Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const CustomerManage = () => {
  const [bookings, setBookings] = useState([
    { id: 1, name: "Pratya", package: "น้ำตกทรายขาว", status: "Pending" },
    { id: 2, name: "Sasit", package: "วัดทรายขาว", status: "Pending" },
    { id: 3, name: "Weeraphat", package: "หาดทรายขาว", status: "Approved" },
  ]);

  const updateStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === id ? { ...booking, status } : booking))
    );
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Customer Name", dataIndex: "name", key: "name" },
    { title: "Package", dataIndex: "package", key: "package" },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status",
      render: (status) => (
        <span style={{ color: status === "Approved" ? "green" : "orange", fontWeight: "bold" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <>
          <Button 
            type="primary" 
            onClick={() => updateStatus(record.id, "Approved")}
            icon={<CheckOutlined />} 
            style={{ marginRight: "8px" }}
          />
          <Button 
            type="danger" 
            onClick={() => updateStatus(record.id, "Rejected")}
            icon={<CloseOutlined />} 
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f5f5", padding: "20px" }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", width: "100%", maxWidth: "800px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>Customer Booking Management</h1>
        <Table 
          columns={columns} 
          dataSource={bookings} 
          pagination={false} 
          rowKey="id"
        />
      </div>
    </div>
  );
};
//
export default CustomerManage;
