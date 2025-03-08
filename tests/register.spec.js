import { test, expect } from '@playwright/test';

test.describe('Register Page', () => {
  
  test.beforeEach(async ({ page }) => {
    // ไปที่หน้า Register
    await page.goto('http://localhost:5173/register');
  });

  test('should render the registration form', async ({ page }) => {
    // ตรวจสอบว่าเราเห็นฟอร์ม
    await expect(page.locator('text=ชื่อผู้ใช้')).toBeVisible();
    await expect(page.locator('text=อีเมลล์')).toBeVisible();
    await expect(page.locator('text=รหัสผ่าน')).toBeVisible();
    await expect(page.locator('text=ยืนยันรหัสผ่าน')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error if password and confirm password do not match', async ({ page }) => {
    // กรอกข้อมูลที่ไม่ตรงกันในช่องรหัสผ่าน
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="ConfirmPassword"]', 'password321');

    // คลิกปุ่มสมัครสมาชิก
    await page.click('button[type="submit"]');

    // รอให้ข้อความข้อผิดพลาดปรากฏ
    await expect(page.locator('text=รหัสผ่านไม่ตรงกัน')).toBeVisible();
  });
});
