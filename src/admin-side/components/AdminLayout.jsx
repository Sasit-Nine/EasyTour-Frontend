import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, Link } from "react-router-dom";
import { AppstoreAddOutlined, UserOutlined, DashboardOutlined } from "@ant-design/icons";
import "../../css/Navbar.scss";
import NavbarAdmin from "./Navbar";

const { Sider, Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavbarAdmin />
      <Layout>
        <Sider width={250} style={{ background: "#fff" }}>
          <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%" }}>
            <Menu.Item key="1" icon={<DashboardOutlined />}>
              <Link to="/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
              <Link to="/package_manage">Package Manager</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              <Link to="/customer_manage">Customer Manager</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<AppstoreAddOutlined />}>
              <Link to="/add_package">Add Package</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "24px", width: "100%" }}>
          <Content style={{ background: "#fff", padding: 24 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
