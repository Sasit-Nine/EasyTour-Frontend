import React from "react";
import { Table, Card, Row, Col, Statistic, Typography } from "antd";
import { BarChartOutlined, LoginOutlined, HistoryOutlined } from '@ant-design/icons'; 
import { Column } from '@ant-design/charts'; 

const { Title } = Typography;

const Dashboard = () => {
  const bookingHistoryData = [
    { key: "1", bookingId: "T001", customerName: "John Doe", tourPackage: "Beach Tour", bookingDate: "2023-10-01", totalAmount: "5000" },
    { key: "2", bookingId: "T002", customerName: "Jane Smith", tourPackage: "Mountain Tour", bookingDate: "2023-10-02", totalAmount: "7500" },
    { key: "3", bookingId: "T003", customerName: "Alice Johnson", tourPackage: "City Tour", bookingDate: "2023-10-05", totalAmount: "6000" },
    { key: "4", bookingId: "T004", customerName: "Bob Brown", tourPackage: "Desert Tour", bookingDate: "2023-10-07", totalAmount: "8000" },
    { key: "5", bookingId: "T005", customerName: "Charlie Davis", tourPackage: "Island Tour", bookingDate: "2023-10-10", totalAmount: "4000" },
    { key: "6", bookingId: "T006", customerName: "David Clark", tourPackage: "River Tour", bookingDate: "2023-10-12", totalAmount: "5500" },
    { key: "7", bookingId: "T007", customerName: "Emma Moore", tourPackage: "Safari Tour", bookingDate: "2023-10-15", totalAmount: "9500" },
    { key: "8", bookingId: "T008", customerName: "Frank Wilson", tourPackage: "Mountain Tour", bookingDate: "2023-10-18", totalAmount: "7500" },
    { key: "9", bookingId: "T009", customerName: "Grace Taylor", tourPackage: "Beach Tour", bookingDate: "2023-10-20", totalAmount: "5000" },
    { key: "10", bookingId: "T010", customerName: "Hank Adams", tourPackage: "City Tour", bookingDate: "2023-10-22", totalAmount: "6000" },
  ];

  const columns = [
    { title: "Booking ID", dataIndex: "bookingId" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Tour Package", dataIndex: "tourPackage" },
    { title: "Booking Date", dataIndex: "bookingDate" },
    { title: "Total Amount (THB)", dataIndex: "totalAmount" },
  ];

  const bookingData = [
    { month: 'Jan', type: '2023', value: 200 },
    { month: 'Jan', type: '2024', value: 250 },
    { month: 'Feb', type: '2023', value: 350 },
    { month: 'Feb', type: '2024', value: 400 },
    { month: 'Mar', type: '2023', value: 380 },
    { month: 'Mar', type: '2024', value: 450 },
    { month: 'Apr', type: '2023', value: 500 },
    { month: 'Apr', type: '2024', value: 600 },
    { month: 'May', type: '2023', value: 580 },
    { month: 'May', type: '2024', value: 650 },
    { month: 'Jun', type: '2023', value: 620 },
    { month: 'Jun', type: '2024', value: 750 },
  ];

  const revenueData = [
    { month: 'Jan', type: '2023', value: 5000 },
    { month: 'Jan', type: '2024', value: 7000 },
    { month: 'Feb', type: '2023', value: 6500 },
    { month: 'Feb', type: '2024', value: 9000 },
    { month: 'Mar', type: '2023', value: 7200 },
    { month: 'Mar', type: '2024', value: 11000 },
    { month: 'Apr', type: '2023', value: 8500 },
    { month: 'Apr', type: '2024', value: 13000 },
    { month: 'May', type: '2023', value: 9500 },
    { month: 'May', type: '2024', value: 15000 },
    { month: 'Jun', type: '2023', value: 10000 },
    { month: 'Jun', type: '2024', value: 17000 },
  ];

  const bookingChartConfig = {
    data: bookingData,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#52c41a', '#faad14'], // กำหนดสีให้ปี 2023 และ 2024
    label: {
      position: 'top',
      style: {
        fill: '#000',
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    legend: {
      position: 'top', // จัดตำแหน่ง Legend ให้อยู่ด้านบน
      itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#333', // ปรับสีของ Legend
      },
    },
    tooltip: {
      showMarkers: false, // ไม่แสดงมาร์คเกอร์
    },
    // เพิ่มการจัดกลุ่มด้วย colorField
    colorField: 'type',
  };

  const revenueChartConfig = {
    data: revenueData,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#ff4d4f', '#1890ff'], // กำหนดสีให้ปี 2023 และ 2024
    label: {
      position: 'top',
      style: {
        fill: '#000',
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    legend: {
      position: 'top', // จัดตำแหน่ง Legend ให้อยู่ด้านบน
      itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#333', // ปรับสีของ Legend
      },
    },
    tooltip: {
      showMarkers: false, // ไม่แสดงมาร์คเกอร์
    },
    // เพิ่มการจัดกลุ่มด้วย colorField
    colorField: 'type',
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f0f2f5" }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px'}}>Dashboard By Team-9</Title>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} hoverable style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title="Total Bookings"
              value={bookingHistoryData.length} 
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600', fontSize: '20px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} hoverable style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title="Total Revenue"
              value={bookingHistoryData.reduce((sum, booking) => sum + parseFloat(booking.totalAmount), 0)} 
              prefix={<LoginOutlined />}
              valueStyle={{ color: '#cf1322', fontSize: '20px', fontWeight: 'bold' }}
              suffix="THB"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} hoverable style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title="Pending Bookings"
              value={2} 
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '20px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: "30px" }}>
        <Col span={12}>
          <Card title="Bookings Over Time" bordered={false} hoverable style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Column {...bookingChartConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue Over Time" bordered={false} hoverable style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Column {...revenueChartConfig} />
          </Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={bookingHistoryData} pagination={false} style={{ marginTop: "30px" }} />
    </div>
  );
};

export default Dashboard;
