import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom"; // ใช้สำหรับการเชื่อมโยง
import { DashboardOutlined, AppstoreAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Navbar from "./Navbar"; // เพิ่ม Navbar ที่คุณจะใช้

const { Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Sider (เมนูข้างๆ) */}
      <Layout>
        <Sider width={200} style={{ background: "#fff", paddingTop: "16px" }}>
          <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0 }}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
              <Link to="/package_manage">Package Manage</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
              <Link to="/customer_manage">Customer Manage</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<AppstoreAddOutlined />}>
              <Link to="/add_package">Add Package</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Content (พื้นที่แสดงเนื้อหาของแต่ละ Route) */}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            {children} {/* จะทำการแสดงผลของทุก Route ที่กำหนด */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
