import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {

    test('should login successfully and redirect to home', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.fill('input[name="username"]', 'usereb');
        await page.fill('input[name="password"]', '1234567');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('http://localhost:5173/');
    });

    test('should show error message on invalid login', async ({ page }) => {
        await page.goto('http://localhost:5173/login');

        await page.fill('input[name="username"]', 'wronguser');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        await expect(page.locator('text=ชื่อผู้ใช้หรือรหัสผ่านผิดพลาด')).toBeVisible();
    });

});
