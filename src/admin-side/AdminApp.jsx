import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarAdmin from "./components/navbar";
import Dashboard from "./subpage/Dashboard";
import PackageManage from "./subpage/PackageManage";
import CustomerManage from "./subpage/CustomerManage";
import AddPackage from "./subpage/AddPackage";
const AdminApp = () => {
    return (
        <Router>
            <div>
                <NavbarAdmin></NavbarAdmin>
                <div>
                    <Routes>
                        <Route path="/" element={<Dashboard></Dashboard>}></Route>
                        <Route path="/customer_manage" element={<CustomerManage></CustomerManage>}></Route>
                        <Route path="/package_manage" element={<PackageManage></PackageManage>}></Route>
                    </Routes>
                </div>
            </div>
        </Router>
    )
}
export default AdminApp