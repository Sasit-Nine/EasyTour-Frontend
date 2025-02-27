import React from 'react'
import './App.css'
import CustomerApp from './customers-side/CustomerApp'
import AdminApp from './admin-side/AdminApp'
import { useAuth } from './context/AuthContext'

function App() {
  // const { user } = useAuth();

  return <CustomerApp></CustomerApp>

  // if (user) {
  //   if(user.role?.name === "Admin"){
  //     return <AdminApp />
  //   }
  //   if(user.role?.name === "Customer" || !user){
  //     return <CustomerApp />
  //   }
  // }
  // return <CustomerApp />
  
}

export default App;
