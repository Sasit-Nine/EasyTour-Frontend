import React from "react";
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter import
import Dashboard from "../subpage/Dashboard";
import PackageManage from "../subpage/PackageManage";
import CustomerManage from "../subpage/CustomerManage";
import AddPackage from "../subpage/AddPackage";
import AdminChat from "../subpage/AdminChat";

const ContentLayout = () => {
    return(
        // Remove the Router wrapper, keep only Routes
        <Routes>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/package_manage" element={<PackageManage />} />
            <Route path="/customer_manage" element={<CustomerManage />} />
            <Route path="/add_package" element={<AddPackage />} />
            <Route path="/admin_chat" element={<AdminChat />} />
        </Routes>
    )
}
export default ContentLayout