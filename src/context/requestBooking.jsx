import { createContext, useContext, useState } from "react";

// สร้าง Context สำหรับการจอง
const BookingContext = createContext();

// สร้าง Provider เพื่อแชร์ข้อมูลการจอง
export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);

    // ฟังก์ชันเพิ่มการจอง
    const addBooking = (newBooking) => {
        setBookings((prev) => [...prev, { id: prev.length + 1, ...newBooking }]);
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

// Custom Hook ใช้ดึงข้อมูลจาก Context
export const useBooking = () => {
    return useContext(BookingContext);
};
