import React from "react";
import { Table, Card, Row, Col, Statistic, Typography } from "antd";
import { BarChartOutlined, LoginOutlined, HistoryOutlined } from '@ant-design/icons'; 
import { Line } from '@ant-design/charts'; 

const { Title } = Typography;

const Dashboard = () => {
  const bookingHistoryData = [
    { key: "1", bookingId: "T001", customerName: "John Doe", tourPackage: "Beach Tour", bookingDate: "2023-10-01", totalAmount: "5000" },
    { key: "2", bookingId: "T002", customerName: "Jane Smith", tourPackage: "Mountain Tour", bookingDate: "2023-10-02", totalAmount: "7500" },
    // เพิ่มข้อมูลเพิ่มเติมถ้าจำเป็น
  ];

  const columns = [
    { title: "Booking ID", dataIndex: "bookingId" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Tour Package", dataIndex: "tourPackage" },
    { title: "Booking Date", dataIndex: "bookingDate" },
    { title: "Total Amount (THB)", dataIndex: "totalAmount" },
  ];

  // ข้อมูลกราฟการจอง (Bookings Over Time)
  const data = [
    { month: 'Jan', value: 300 },
    { month: 'Feb', value: 450 },
    { month: 'Mar', value: 500 },
    { month: 'Apr', value: 650 },
    { month: 'May', value: 700 },
    { month: 'Jun', value: 800 },
  ];

  // ข้อมูลกราฟรายรับ (Revenue Over Time)
  const revenueData = [
    { month: 'Jan', value: 5000 },
    { month: 'Feb', value: 7500 },
    { month: 'Mar', value: 8000 },
    { month: 'Apr', value: 9000 },
    { month: 'May', value: 11000 },
    { month: 'Jun', value: 12000 },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'value',
    label: {
      position: 'middle',
    },
  };

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    label: {
      position: 'middle',
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center' }}>
            <Statistic
              title="Total Bookings"
              value={bookingHistoryData.length} 
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center' }}>
            <Statistic
              title="Total Revenue"
              value={bookingHistoryData.reduce((sum, booking) => sum + parseFloat(booking.totalAmount), 0)} 
              prefix={<LoginOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix="THB"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center' }}>
            <Statistic
              title="Pending Bookings"
              value={2} 
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* กราฟ Bookings Over Time และ Revenue Over Time อยู่ในแถวเดียวกัน */}
      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Bookings Over Time" bordered={false}>
            <Line {...config} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue Over Time" bordered={false}>
            <Line {...revenueConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Recent 10 Tour Bookings" bordered={false}>
            <Table columns={columns} dataSource={bookingHistoryData} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
