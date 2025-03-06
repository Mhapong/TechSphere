const { test, expect } = require("@playwright/test");

test.describe("Explore Page - Filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/explore");
  });

  test("Should load course data successfully", async ({ page }) => {
    await expect(page.locator('h1:text("คอร์สที่ค้นหา")')).toBeVisible();
  });

  test("Should filter courses by search query", async ({ page }) => {
    await page.fill('input[placeholder="Search courses..."]', "React");
    await page.waitForTimeout(1000);
    const courseCount = await page.locator(".grid > div").count();
    expect(courseCount).toBeGreaterThan(0);
  });

  test("Should filter courses by category", async ({ page }) => {
    await page.click("text=หมวดหมู่คอร์ส");
    await page.click("text=Web Develop");
    await page.waitForTimeout(1000);
    const courseCount = await page.locator(".grid > div").count();
    expect(courseCount).toBeGreaterThan(0);
  });

  test("Should filter courses by rating", async ({ page }) => {
    await page.click('input[id="rating-4"]');
    await page.waitForTimeout(1000);
    const courseCount = await page.locator(".grid > div").count();
    expect(courseCount).toBeGreaterThan(0);
  });

  test("Should reset filters", async ({ page }) => {
    await page.click("text=รีเซ็ตค่าที่ใช้");
    await page.waitForTimeout(1000);

    const courseCount = await page.locator(".grid > div").count();
    expect(courseCount).toBeGreaterThan(0);
  });
});
