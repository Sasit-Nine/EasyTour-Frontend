import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./subpage/Dashboard";
import PackageManage from "./subpage/PackageManage";
import CustomerManage from "./subpage/CustomerManage";
import AddPackage from "./subpage/AddPackage";
import AdminLayout from "./components/AdminLayout";
const AdminApp = () => {
    return (
        <AdminLayout></AdminLayout>
    )
}
export default AdminApp