import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./subpage/Home";
import PackageDetail from "./subpage/PackageDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "../auth/LoginPage";
import Register from "../auth/RegisterPage";
import Payment from "./subpage/Payment";
import Booking from "./subpage/Booking";
import CheckoutSuccess from "./subpage/CheckoutSuccess";
import FilterPackage from "./components/FilterPackage";
import Status from "./subpage/Status";
// Import AdminChat only if the component exists and is properly implemented
// import AdminChat from "./subpage/AdminChat";

const CustomerApp = () => {
    return ( 
        <Router>
        <div>
            <Navbar />
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/packages" element={<FilterPackage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/packages/:documentId" element={<PackageDetail />} />
                    <Route path="/checkout-success" element={<CheckoutSuccess />} />
                    <Route path="/status" element={<Status />} />
                    {/* Comment out this route if AdminChat is causing issues */}
                    {/* <Route path="/chat" element={<AdminChat />} /> */}
                </Routes>
            </div>
            <Footer />
        </div>
        </Router>
    )
}

export default CustomerApp;