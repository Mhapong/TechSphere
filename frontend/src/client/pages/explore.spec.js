const { test, expect } = require("@playwright/test");

test.describe("Explore Page - Filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/explore");
  });

  test("Should load course data successfully", async ({ page }) => {
    await expect(page.locator('h1:text("คอร์สที่ค้นหา")')).toBeVisible();
  });

  test("Should filter courses by search query", async ({ page }) => {
    await page.fill('input[placeholder="Search courses..."]', "Javascript");
    await page.waitForSelector('.grid > div:has-text("Javascript")');
    const courseCount = await page
      .locator('.grid > div:has-text("Javascript")')
      .count();
    expect(courseCount).toBeGreaterThan(0);
  });

  test("Should reset filters", async ({ page }) => {
    await page.click("text=รีเซ็ตค่าที่ใช้");
    await page.waitForTimeout(2000);
    const courseCount = await page.locator(".grid > div").count();
    expect(courseCount).toBeGreaterThan(0);
  });

  test("Should display no courses found message", async ({ page }) => {
    await page.fill(
      'input[placeholder="Search courses..."]',
      "Nonexistent Course"
    );
    await page.waitForSelector("text=❌ ไม่พบคอร์สที่ต้องการ");
    await expect(page.locator("text=❌ ไม่พบคอร์สที่ต้องการ")).toBeVisible();
  });

  test("Should navigate to viewCourse page", async ({ page }) => {
    await page.click(".grid > div");
    await expect(page.url()).toContain("/view-product/");
  });
});
