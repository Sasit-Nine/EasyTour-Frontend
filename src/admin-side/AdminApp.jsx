import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom"; // ใช้ Router แทน BrowserRouter
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./subpage/Dashboard";
import PackageManage from "./subpage/PackageManage";
import CustomerManage from "./subpage/CustomerManage";
import AddPackage from "./subpage/AddPackage"; // เพิ่ม AddPackage ที่นี่
import AdminChat from "./subpage/AdminChat"; // เพิ่ม AdminChat component

const AdminApp = () => {
  return (
      <AdminLayout>
      </AdminLayout>
  );
};

export default AdminApp;