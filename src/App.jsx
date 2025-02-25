import React from 'react'
import './App.css'
import CustomerApp from './customers-side/CustomerApp'
import AdminApp from './admin-side/AdminApp'
import { BookingProvider } from "./context/requestBooking";

function App() {
  return (
    <BookingProvider>
      <CustomerApp></CustomerApp> 
    </BookingProvider>
  )
}

export default App;