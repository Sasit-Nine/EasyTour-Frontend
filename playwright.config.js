// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // โฟลเดอร์ที่เก็บไฟล์ทดสอบ
  fullyParallel: true, // รันทดสอบพร้อมกัน
  retries: 1, // ลองใหม่ 1 ครั้งถ้าล้มเหลว
  workers: 2, // จำนวน thread ที่รันพร้อมกัน
  reporter: 'html', // สร้างรายงานในรูปแบบ HTML

  // ตั้งค่า URL พื้นฐานสำหรับ Vite dev server
  webServer: {
    command: 'npm run dev', // คำสั่งรัน Vite dev server
    url: 'http://localhost:5173', // URL ของ dev server
    timeout: 120 * 1000, // รอสูงสุด 120 วินาที
    reuseExistingServer: !process.env.CI, // ใช้ server เดิมถ้าไม่ใช่ CI
  },

  use: {
    baseURL: 'http://localhost:5173', // URL เริ่มต้นสำหรับการทดสอบ
    trace: 'on-first-retry', // บันทึก trace เมื่อลองใหม่
  },

  // รองรับเบราว์เซอร์หลายตัว
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});