import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./subpage/Dashboard";
import PackageManage from "./subpage/PackageManage";
import CustomerManage from "./subpage/CustomerManage";
import AddPackage from "./subpage/AddPackage";

const AdminApp = () => {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/packages" element={<PackageManage />} />
          <Route path="/customers" element={<CustomerManage />} />
          <Route path="/add-package" element={<AddPackage />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
};

export default AdminApp;