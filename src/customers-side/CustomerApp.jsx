import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./subpage/Home";
// import Booking from "./subpage/Booking";
import PackageList from "./subpage/PackageList";
import PackageDetail from "./subpage/PackageDetail";
// import Payment from "./subpage/Payment";
// import Status from "./subpage/Status";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "../auth/LoginPage";
import Register from "../auth/RegisterPage"

const CustomerApp = () => {
    return ( 
        <Router>
        <div>
            <Navbar></Navbar>
            <div>
                    <Routes>
                        <Route path="/" element={<Home></Home>}></Route>
                        <Route path="/packages" element={<PackageList></PackageList>}></Route>
                        <Route path="/login" element={<Login></Login>}></Route>
                        <Route path="/register" element={<Register></Register>}></Route>
                    </Routes>
            </div>
            <Footer></Footer>
        </div>
        </Router>
    )
}

export default CustomerApp;