import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Dashboard from "../subpage/Dashboard";
import PackageManage from "../subpage/PackageManage";
import CustomerManage from "../subpage/CustomerManage";
import AddPackage from "../subpage/AddPackage";
import EditPackage from "../subpage/EditPackage";
import History from "../subpage/History";
import Settings from "../../customers-side/subpage/Settings";

const ContentLayout = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<PackageManage />} />
                <Route path="/customer_manage" element={<CustomerManage />} />
                <Route path="/add_package" element={<AddPackage />} />
                <Route path="/history" element={<History />} />
                <Route path="/:documentId" element={<EditPackage></EditPackage>}></Route>
                <Route path="/admin/setting" element={<Settings></Settings>}></Route>
            </Routes>
        </Router>
    )
}
export default ContentLayout