import { test, expect } from "@playwright/test";

test.describe("ตรวจสอบหน้าสำรวจตัวเอง", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.fill('input[placeholder="กรุณาใส่ชื่อผู้ใช้งาน"]', "user");
    await page.fill('input[placeholder="กรุณาใส่รหัสผ่าน"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL("http://localhost:3000/");
  });

  test("การเข้าถึงหน้าสำรวจตัวเอง", async ({ page }) => {
    await page.click('img[alt="user Avatar"]');
    await page.click('text=สำรวจตัวเอง');
    await expect(page).toHaveURL("http://localhost:3000/suggest-course");
    await expect(page.locator("h2")).toHaveText("สำรวจตัวเอง");
  });

  test("ตรวจสอบปุ่มค้นหาตอนเริ่มต้นต้องถูกปิดใช้งาน", async ({ page }) => {
    await page.goto("http://localhost:3000/suggest-course");
    const searchButton = page.locator('button:has-text("ค้นหา")');
    await expect(searchButton).toBeDisabled();
  });

  test('เลือกคะแนนและรีเซต SuggestCourse', async ({ page }) => {
    await page.goto('http://localhost:3000/suggest-course');
  
    for (let i = 0; i < 12; i++) {
      await page.locator(`.space-y-6 > div:nth-of-type(${i + 1}) label`).nth(8).click();
    }
  
    await page.locator('button:has-text("ยกเลิก")').click();
  
    for (let i = 0; i < 12; i++) {
      await expect(
        page.locator(`input[name="feedback-${i}"][value="4"]`)
      ).toBeChecked();
    }
  });

  test('ตรวจสอบว่า Dialog เปิดขึ้นเมื่อกดค้นหา', async ({ page }) => {
    await page.goto('http://localhost:3000/suggest-course');
  
    for (let i = 0; i < 12; i++) {
      await page.locator(`.space-y-6 > div:nth-of-type(${i + 1}) label`).nth(8).click();
    }
  
    await page.locator('button:has-text("ค้นหา")').click();
    await page.waitForSelector('h3:text("ไปหาคอร์สเรียนประเภท")', { timeout: 5000 });
    const dialogTitle = page.locator('h3:text("ไปหาคอร์สเรียนประเภท")');
    await expect(dialogTitle).toBeVisible();
  });
  
  
  test('ตรวจสอบการกดยืนยันใน Dialog เพื่อนำทาง', async ({ page }) => {
    await page.goto('http://localhost:3000/suggest-course');
  
    for (let i = 0; i < 12; i++) {
      await page.locator(`.space-y-6 > div:nth-of-type(${i + 1}) label`).nth(8).click();
    }
  
    await page.locator('button:has-text("ค้นหา")').click();
    await page.locator('button:has-text("ไปยังหน้ารวมคอร์สประเภท")').click();
    await page.waitForURL("http://localhost:3000/explore");
    await expect(page).toHaveURL("http://localhost:3000/explore");
  });

});
