import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/requestBooking";  
import CustomerApp from "./customers-side/CustomerApp";  // ✅ ใช้ CustomerApp แทน AdminLayout

function App() {
  return (
    <BookingProvider> {/* ✅ ครอบ BookingProvider ไว้รอบ Router */}
      <Router>
        <CustomerApp /> {/* ✅ แสดงฝั่ง Customer แทน Admin */}
      </Router>
    </BookingProvider>
  );
}

export default App;
