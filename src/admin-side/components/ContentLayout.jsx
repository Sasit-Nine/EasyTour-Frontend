import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Dashboard from "../subpage/Dashboard";
import PackageManage from "../subpage/PackageManage";
import CustomerManage from "../subpage/CustomerManage";
import AddPackage from "../subpage/AddPackage";
const ContentLayout = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/package_manage" element={<PackageManage />} />
                <Route path="/customer_manage" element={<CustomerManage />} />
                <Route path="/add_package" element={<AddPackage />} />
            </Routes>
        </Router>
    )
}
export default ContentLayout