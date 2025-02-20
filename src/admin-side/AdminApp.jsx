import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"; // ใช้ Router แทน BrowserRouter
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./subpage/Dashboard";
import PackageManage from "./subpage/PackageManage";
import CustomerManage from "./subpage/CustomerManage";

const AdminApp = () => {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/package_manage" element={<PackageManage />} />
          <Route path="/customer_manage" element={<CustomerManage />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
};

export default AdminApp;
