import React from 'react'
import './App.css'
import CustomerApp from './customers-side/CustomerApp'
import AdminApp from './admin-side/AdminApp'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth();

  if (!user) {
    return <CustomerApp />;
  }

  return user.role?.name === "Admin" ? <AdminApp /> : <CustomerApp />;
}

export default App;
