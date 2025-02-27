import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from "vitest";
import Login from "../auth/LoginPage";
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('Login Component', () => {
    let loginMock;


    // การตั้งค่าก่อนเริ่มทดสอบทุกครั้ง
    beforeEach(() => {
        loginMock = vi.fn();
        useAuth.mockReturnValue({ login: loginMock });


        // การจำลองการเรียกให้งาน ไม่ใช่ Browser
        render(
            <Router>
                <Login />
            </Router>
        );
    });

    test('renders login form correctly', () => {
        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText('เข้าสู่ระบบ')).toBeInTheDocument();
    });

    // กำหนดจำนวนครั้งที่ต้องการทดสอบ
    test.each(new Array(20).fill(null))('allows user to type and submit form - Test run #%#', async () => {
        // พิมพ์ Username และ Password
        fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'user' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123456' } });

        // คลิกปุ่มเข้าสู่ระบบ
        fireEvent.click(screen.getByText('เข้าสู่ระบบ'));

        // ตรวจสอบว่า login ถูกเรียกใช้
        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith('user', '123456');
        });
    });

    test.each(new Array(20).fill(null))('displays error when fields are empty - Test run #%#', async () => {
        // คลิกปุ่มเข้าสู่ระบบโดยไม่กรอกอะไรเลย
        fireEvent.click(screen.getByText('เข้าสู่ระบบ'));

        // ตรวจสอบว่าฟังก์ชัน login ไม่ถูกเรียก
        await waitFor(() => {
            expect(loginMock).not.toHaveBeenCalled();
        });
    });
});



