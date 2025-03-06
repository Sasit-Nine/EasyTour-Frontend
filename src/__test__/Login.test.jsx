import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter as Router } from 'react-router-dom';
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
        loginMock = vi.fn(() => Promise.resolve());
        useAuth.mockReturnValue({ login: loginMock });


        // การจำลองการเรียกให้งาน ไม่ใช่ Browser
        render(
            <Router>
                <Login />
            </Router>
        );
    });

    test('renders login form correctly', () => {
        expect(screen.getByPlaceholderText(/ชื่อผู้ใช้/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/รหัสผ่าน/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /เข้าสู่ระบบ/i })).toBeInTheDocument();
    });

    // กำหนดจำนวนครั้งที่ต้องการทดสอบ
    test.each(new Array(20).fill(null))('allows user to type and submit form - Test run #%#', async () => {
        const usernameInput = screen.getByPlaceholderText(/ชื่อผู้ใช้/i);
        const passwordInput = screen.getByPlaceholderText(/รหัสผ่าน/i);

        fireEvent.change(usernameInput, { target: { value: "user" } });
        fireEvent.change(passwordInput, { target: { value: "123456" } });

        expect(usernameInput.value).toBe("user");
        expect(passwordInput.value).toBe("123456");
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



