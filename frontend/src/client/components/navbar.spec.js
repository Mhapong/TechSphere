import { test, expect } from '@playwright/test';

test.describe('Navbar Tests (Not Authenticated)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000'); // ปรับ URL ตามโปรเจกต์จริง
    });

    // Test การแสดงผล Navbar
    test('Should display the navbar properly', async ({ page }) => {
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.locator('text=หน้าแรก')).toBeVisible();
        await expect(page.locator('text=สำรวจคอร์ส')).toBeVisible();
        await expect(page.locator('text=เกี่ยวกับเรา')).toBeVisible();
    });

    // Test การไปที่หน้าสำรวจคอร์ส
    test('Should navigate to Explore page', async ({ page }) => {
        await page.click('text=สำรวจคอร์ส');
        await expect(page).toHaveURL(/.*explore/);
    });

    // Test การไปที่หน้าข้อมูลเกี่ยวกับเรา
    test('Should navigate to About page', async ({ page }) => {
        await page.click('text=เกี่ยวกับเรา');
        await expect(page).toHaveURL(/.*about/);
    });

    // Test ตรวจสอบการแสดงปุ่มเข้าสู่ระบบและสมัครสมาชิกเมื่อไม่ได้ล็อกอิน
    test('Should show login and signup buttons when not authenticated', async ({ page }) => {
        await expect(page.locator('text=เข้าสู่ระบบ')).toBeVisible();
        await expect(page.locator('text=สมัครสมาชิก')).toBeVisible();
    });

    // Test ไปที่หน้า login
    test('Should navigate to login page', async ({ page }) => {
        await page.click('text=เข้าสู่ระบบ');
        await expect(page).toHaveURL(/.*login/);
    });

    // Test ไปที่หน้า signup
    test('Should navigate to sign-up page', async ({ page }) => {
        await page.click('text=สมัครสมาชิก');
        await expect(page).toHaveURL(/.*sign-up/);
    });
    test('Should not show profile dropdown when not authenticated', async ({ page }) => {
        await expect(page.locator('img[alt="user Avatar"]')).toHaveCount(0);
    });    
    test.describe('Navbar Tests (Authenticated)', () => {
        test.beforeEach(async ({ page }) => {
            // ไปที่หน้า login และทำการเข้าสู่ระบบ
            await page.goto('http://localhost:3000/login');
            await page.fill('input[placeholder="กรุณาใส่ชื่อผู้ใช้งาน"]', "user");
            await page.fill('input[placeholder="กรุณาใส่รหัสผ่าน"]', "123456");
            await page.click('button[type="submit"]');

            // รอให้เปลี่ยนเส้นทางไปยังหน้าหลักหลังจากล็อกอิน
            await page.waitForURL('http://localhost:3000/');
        });

        // ✅ ตรวจสอบว่าหลังล็อกอินแล้ว Navbar แสดงผลถูกต้อง
        test('Should display correct navbar after login', async ({ page }) => {
            await expect(page.locator('nav')).toBeVisible();

            // ไม่ควรมีปุ่มเข้าสู่ระบบ และสมัครสมาชิก
            await expect(page.locator('text=เข้าสู่ระบบ')).toHaveCount(0);
            await expect(page.locator('text=สมัครสมาชิก')).toHaveCount(0);
        });

        // ✅ ตรวจสอบว่าเมนูโปรไฟล์สามารถเปิดได้ และมีตัวเลือก "ออกจากระบบ"
        test('Should open profile menu and logout', async ({ page }) => {
            await page.click('img[alt="user Avatar"]');
            await expect(page.locator('text=โปรไฟล์')).toBeVisible();
            await expect(page.locator('text=ลงชื่อออก')).toBeVisible();

            // ทดสอบการล็อกเอาต์
            await page.click('text=ลงชื่อออก');
            await page.waitForURL('http://localhost:3000/');

            // หลังล็อกเอาต์ ควรกลับมาแสดงปุ่ม "เข้าสู่ระบบ" และ "สมัครสมาชิก"
            await expect(page.locator('text=เข้าสู่ระบบ')).toBeVisible();
            await expect(page.locator('text=สมัครสมาชิก')).toBeVisible();
        });
    });
});

