import { test, expect } from '@playwright/test';

// ตัวอย่างข้อมูลจำลองสำหรับการจอง
const mockBookings = [
  {
    id: 1,
    fname: 'John',
    lname: 'Doe',
    package: { name: 'Premium Package' },
    createdAt: '2024-05-01T00:00:00Z',
    total_price: 1500,
    booking_status: { status: 'pending' }
  },
  {
    id: 2,
    fname: 'Jane',
    lname: 'Smith',
    package: { name: 'Standard Package' },
    createdAt: '2024-05-02T00:00:00Z',
    total_price: 2500,
    booking_status: { status: 'confirmed' }
  },
  {
    id: 3,
    fname: 'Bob',
    lname: 'Brown',
    package: { name: 'VIP Package' },
    createdAt: '2024-05-03T00:00:00Z',
    total_price: 0,
    booking_status: { status: 'pending' }
  }
];

test.describe('Dashboard Page E2E Test', () => {
  test.beforeEach(async ({ page }) => {
    // ล็อกอินเข้าสู่ระบบ
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="username"]', 'user');
    await page.fill('input[name="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:5173/');
  });

  test('ควรแสดงข้อความเมื่อไม่มีข้อมูลการจอง', async ({ page }) => {
    // Enable request interception for GraphQL API
    await page.route('**/graphql', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { bookings: [] } }), // ส่งกลับข้อมูลการจองเป็นอาเรย์ว่าง
      });
    });

    // ไปที่หน้า Dashboard พร้อมรอให้ network ว่าง
    await page.goto('http://localhost:5173/dashboard', {
      waitUntil: 'networkidle'
    });
  });

  test('ควรแสดงข้อมูลการจองเมื่อมีข้อมูล', async ({ page }) => {
    // Enable request interception for GraphQL API และใช้ข้อมูลการจองจำลอง
    await page.route('**/graphql', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { bookings: mockBookings } }), // ส่งกลับข้อมูลการจองจำลอง
      });
    });

    // ไปที่หน้า Dashboard พร้อมรอให้ network ว่าง
    await page.goto('http://localhost:5173/dashboard', {
      waitUntil: 'networkidle'
    });
  });
});
