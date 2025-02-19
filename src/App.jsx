import React from "react";
import "./App.css";
import AdminLayout from "./admin-side/components/AdminLayout";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./admin-side/subpage/Dashboard";
import PackageManage from "./admin-side/subpage/PackageManage";
import CustomerManage from "./admin-side/subpage/CustomerManage";
import AddPackage from "./admin-side/subpage/AddPackage";

function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          {/* Redirect "/" to "/dashboard" */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/package_manage" element={<PackageManage />} />
          <Route path="/customer_manage" element={<CustomerManage />} />
          <Route path="/add_package" element={<AddPackage />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
