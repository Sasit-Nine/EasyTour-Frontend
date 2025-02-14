import React from "react";
import { Table, Card, Row, Col, Statistic, Typography } from "antd";
import { BarChartOutlined, LoginOutlined, HistoryOutlined } from '@ant-design/icons'; 
import { Line } from '@ant-design/charts'; 

const { Title } = Typography;

const Dashboard = () => {
  const bookingHistoryData = [
    { key: "1", bookingId: "T001", customerName: "John Doe", tourPackage: "Beach Tour", bookingDate: "2023-10-01", totalAmount: "5000" },
    { key: "2", bookingId: "T002", customerName: "Jane Smith", tourPackage: "Mountain Tour", bookingDate: "2023-10-02", totalAmount: "7500" },
  ];

  const columns = [
    { title: "Booking ID", dataIndex: "bookingId" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Tour Package", dataIndex: "tourPackage" },
    { title: "Booking Date", dataIndex: "bookingDate" },
    { title: "Total Amount (THB)", dataIndex: "totalAmount" },
  ];

  const data = [
    { month: 'Jan', value: 250 },
    { month: 'Feb', value: 400 },
    { month: 'Mar', value: 450 },
    { month: 'Apr', value: 600 },
    { month: 'May', value: 650 },
    { month: 'Jun', value: 750 },
  ];

  const revenueData = [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 7000 },
    { month: 'Mar', value: 7500 },
    { month: 'Apr', value: 8500 },
    { month: 'May', value: 10000 },
    { month: 'Jun', value: 11000 },
  ];

  const chartConfig = {
    data,
    xField: 'month',
    yField: 'value',
    label: { position: 'middle' },
    point: { size: 5, shape: 'circle' },
    smooth: true,
  };

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'value',
    label: { position: 'middle' },
    point: { size: 5, shape: 'circle' },
    smooth: true,
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard By Team-9</Title>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Total Bookings"
              value={bookingHistoryData.length} 
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} hoverable>
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
          <Card bordered={false} hoverable>
            <Statistic
              title="Pending Bookings"
              value={2} 
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card title="Bookings Over Time" bordered={false} hoverable>
            <Line {...chartConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue Over Time" bordered={false} hoverable>
            <Line {...revenueConfig} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Recent 10 Tour Bookings" bordered={false} hoverable>
            <Table columns={columns} dataSource={bookingHistoryData} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
