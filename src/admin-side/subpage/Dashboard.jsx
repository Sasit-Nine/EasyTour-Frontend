import React, { useEffect, useState } from "react";
import { Table, Card, Row, Col, Statistic, Typography } from "antd";
import { BarChartOutlined, LoginOutlined, HistoryOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';
import { useQuery } from '@apollo/client';
import { QUERY_BOOKING, QUERY_REVENUE } from '../../services/Graphql'; // ลบ QUERY_PENDING_BOOKINGS ออก

const { Title } = Typography;

const Dashboard = ({ pendingBookings }) => {  // รับค่า pendingBookings จาก props
  const { data: bookingsData, loading: bookingsLoading, error: bookingsError } = useQuery(QUERY_BOOKING);
  const { data: revenueData, loading: revenueLoading, error: revenueError } = useQuery(QUERY_REVENUE);

  const [bookingHistoryData, setBookingHistoryData] = useState([]);
  const [bookingChartData, setBookingChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);

  useEffect(() => {
    if (bookingsData) {
      setBookingHistoryData(bookingsData.bookings);
      setBookingChartData(bookingsData.bookingsOverTime); // Assuming data shape for chart
    }
    if (revenueData) {
      setRevenueChartData(revenueData.revenueOverTime); // Assuming data shape for chart
    }
  }, [bookingsData, revenueData]);

  const columns = [
    { title: "Booking ID", dataIndex: "bookingId" },
    { title: "Customer Name", dataIndex: "customerName" },
    { title: "Tour Package", dataIndex: "tourPackage" },
    { title: "Booking Date", dataIndex: "bookingDate" },
    { title: "Total Amount (THB)", dataIndex: "totalAmount" },
  ];

  const bookingChartConfig = {
    data: bookingChartData || [], // Default to empty array if no data
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#52c41a', '#faad14'],
    label: {
      position: 'top',
      style: {
        fill: '#000',
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    legend: {
      position: 'top',
      itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#333',
      },
    },
    tooltip: {
      showMarkers: false,
    },
    colorField: 'type',
  };

  const revenueChartConfig = {
    data: revenueChartData || [],
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#ff4d4f', '#1890ff'],
    label: {
      position: 'top',
      style: {
        fill: '#000',
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    legend: {
      position: 'top',
      itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#333',
      },
    },
    tooltip: {
      showMarkers: false,
    },
    colorField: 'type',
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f0f2f5" }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard By Team-9</Title>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card bordered={false} hoverable style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title="Total Bookings"
              value={bookingsData ? bookingsData.bookings.length : 0}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600', fontSize: '20px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} hoverable style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <Statistic
              title="Total Revenue"
              value={revenueData ? revenueData.totalRevenue : 0}
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
              value={pendingBookings || 0}  // ใช้ค่า pendingBookings ที่รับมาจาก props
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
