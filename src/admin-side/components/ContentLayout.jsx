import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Dashboard from "../subpage/Dashboard";
import PackageManage from "../subpage/PackageManage";
import CustomerManage from "../subpage/CustomerManage";
import AddPackage from "../subpage/AddPackage";
import AdminChat from "../subpage/AdminChat"; // เพิ่ม AdminChat component

const ContentLayout = () => {
    return(
        <Router>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/package_manage" element={<PackageManage />} />
                <Route path="/customer_manage" element={<CustomerManage />} />
                <Route path="/add_package" element={<AddPackage />} />
                <Route path="/admin_chat" element={<AdminChat />} />
            </Routes>
        </Router>
    )
}
export default ContentLayout