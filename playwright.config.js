import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/admin-side/subpage', // ชี้ไปที่โฟลเดอร์ที่มีไฟล์ทดสอบ
  testMatch: ['src/admin-side/subpage/Dashboard.spec.ts'], // ตั้งชื่อไฟล์ทดสอบที่ต้องการ
});
