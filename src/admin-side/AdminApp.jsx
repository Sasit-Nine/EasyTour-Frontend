import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { ChatProvider } from '../context/ChatContext';
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./subpage/Dashboard";
import PackageManage from "./subpage/PackageManage";
import CustomerManage from "./subpage/CustomerManage";
import AddPackage from "./subpage/AddPackage";
import AdminChat from "./subpage/AdminChat"; // Import AdminChat component

const AdminApp = () => {
  return (
    <Router>
      <ChatProvider> {/* Wrap with ChatProvider */}
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/packages" element={<PackageManage />} />
            <Route path="/customers" element={<CustomerManage />} />
            <Route path="/add-package" element={<AddPackage />} />
            <Route path="/chat" element={<AdminChat />} /> {/* Add route for AdminChat */}
          </Routes>
        </AdminLayout>
      </ChatProvider>
    </Router>
  );
};

export default AdminApp;