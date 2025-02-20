import React from "react";
import { Link } from "react-router-dom";
import "../../css/Navbar.scss";
import { Button, Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// ปรับการใช้งาน Menu แทนการใช้ overlay
const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: <Link className='Text' to="/home">Home</Link> // เปลี่ยนเป็น /dashboard แทน /Dashboard
      },
      {
        key: "2",
        label: <Link className='Text' to="/dashboard">Dashboard</Link> // เปลี่ยนเป็น /dashboard แทน /Dashboard
      },
      {
        key: "3",
        label: <Link className='Text' to="/package_manage">Package Manage</Link> // เปลี่ยนเป็น /history แทน /History
      },
      {
        key: "4",
        label: <Link className='Text' to="/customer_manage">Customer Manage</Link> // เปลี่ยนเป็น /history แทน /History
      },
      {
        key: "5",
        label: <Button onClick={() => { alert('Logged out'); }} className='Text'>Log out</Button>
      },
    ]}
  />
);

const NavbarAdmin = () => {
  return (
    <nav className='Nav'>
      <div className='Navbar'>
        <div className='LogoEasyTour'>
          <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
            <b>EasyTour</b>
          </h1>
        </div>

        <div className='Path'>
          {/* ลิงก์ที่ใช้ React Router Link */}
          <Link className='Text' to="/home">Home</Link>
          <Link className='Text' to="/package">Package</Link> {/* เปลี่ยนเส้นทางเป็น /package_manage */}
          <Link className='Text' to="/login">Login</Link>
          <Link className='AuthButton' to="/register">Register</Link>

          {/* เมนู Dropdown */}
          <Dropdown overlay={menu} trigger={['click']}>
            <Button icon={<UserOutlined />}>Admin</Button>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
