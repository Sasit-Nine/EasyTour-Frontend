import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"; // ใช้ Router แทน BrowserRouter
import AdminLayout from "./components/AdminLayout";
import Dashboard from "../subpage/Dashboard";
import PackageManage from "../subpage/PackageManage";
import CustomerManage from "../subpage/CustomerManage";
import AddPackage from "../subpage/AddPackage"; // เพิ่ม AddPackage ที่นี่

const AdminApp = () => {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/package_manage" element={<PackageManage />} />
          <Route path="/customer_manage" element={<CustomerManage />} />
          <Route path="/add_package" element={<AddPackage />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
};

export default AdminApp;
