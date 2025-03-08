import { test, expect } from '@playwright/test';

test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login and navigate to page
    await page.goto('/admin/customer-manage');
    await page.evaluate(() => {
      sessionStorage.setItem('token', 'mock-token');
    });
  });

  test('should display booking table', async ({ page }) => {
    // Mock API response
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      const body = request.postDataJSON();
      
      if (body.operationName === 'QueryBooking') {
        await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              bookings: [{
                documentId: '1',
                fname: 'John',
                lname: 'Doe',
                package: { name: 'Premium' },
                payment: { status_payment: 'สำเร็จ' },
                booking_status: 'pending'
              }]
            }
          })
        });
      }
    });

    await page.waitForSelector('text=จัดการลูกค้า');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should handle approve action', async ({ page }) => {
    await page.route('**/graphql', async (route) => {
      const body = route.request().postDataJSON();
      if (body.operationName === 'MutationApprove') {
        await route.fulfill({ 
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { updateBooking: { success: true } }})
        });
      }
    });

    await page.click('text=อนุมัติ');
    await page.waitForSelector('text=ยืนยันการอนุมัติ');
    await page.click('text=ยืนยัน');
    await expect(page.locator('text=อนุมัติการจอง')).toBeVisible();
  });

  test('should show detail modal', async ({ page }) => {
    await page.click('text=ดูเพิ่มเติม');
    await page.waitForSelector('text=รายละเอียดการจอง');
    await expect(page.locator('text=ที่อยู่:')).toBeVisible();
  });
});