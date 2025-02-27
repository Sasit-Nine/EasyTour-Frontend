import React from 'react'
import './App.css'
import CustomerApp from './customers-side/CustomerApp'
import AdminApp from './admin-side/AdminApp'
import { useAuth } from './context/AuthContext'

// Remove unused imports if you're not using them
// import CustomerChat from './components/CustomerChat';
// import AdminChat from './components/AdminChat';

function App() {
  const { user } = useAuth();

  // Add error handling for when user is undefined
  if (!user) {
    return <CustomerApp />;
  }

  // Make sure role exists before accessing it
  return user.role?.name === "Admin" ? <AdminApp /> : <CustomerApp />;
}

export default App;