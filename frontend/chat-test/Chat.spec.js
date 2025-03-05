import { test, expect } from "@playwright/test";

test.describe("Login and Chat Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });

  test("User : Chat dialog opens when button is clicked", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.fill('input[placeholder="กรุณาใส่ชื่อผู้ใช้งาน"]', "user");
    await page.fill('input[placeholder="กรุณาใส่รหัสผ่าน"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) =>
      url.toString().startsWith("http://localhost:3000/")
    );
    console.log("Page HTML before clicking chat button:", await page.content());
    await page.waitForSelector("button.bg-blue-500", { state: "visible" });
    await page.click("button.bg-blue-500");
    console.log("Page HTML after clicking chat button:", await page.content());
    const ChatTitle = await page.textContent("body");
    expect(ChatTitle).toContain("แชทของ");
  });

  test("Admin : Chat dialog opens when button is clicked", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.fill('input[placeholder="กรุณาใส่ชื่อผู้ใช้งาน"]', "admin");
    await page.fill('input[placeholder="กรุณาใส่รหัสผ่าน"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) =>
      url.toString().startsWith("http://localhost:3000/")
    );
    console.log("Page HTML before clicking chat button:", await page.content());
    await page.waitForSelector("button.bg-blue-500", { state: "visible" });
    await page.click("button.bg-blue-500");
    console.log("Page HTML after clicking chat button:", await page.content());

    const ChatTitle = await page.textContent("body");
    expect(ChatTitle).toContain("แชทของ");
  });

  test("Lecturer : Chat dialog opens when button is clicked", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/login");
    await page.fill('input[placeholder="กรุณาใส่ชื่อผู้ใช้งาน"]', "lecturer");
    await page.fill('input[placeholder="กรุณาใส่รหัสผ่าน"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL((url) =>
      url.toString().startsWith("http://localhost:3000/")
    );
    console.log("Page HTML before clicking chat button:", await page.content());
    await page.waitForSelector("button.bg-blue-500", { state: "visible" });
    await page.click("button.bg-blue-500");
    console.log("Page HTML after clicking chat button:", await page.content());

    const ChatTitle = await page.textContent("body");
    expect(ChatTitle).toContain("แชทของ");
  });

  // only one time
  test("Admin accept course by check QRcode", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" })
      .fill("admin");
    await page.getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" })
      .fill("123456");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("link", { name: "การเงิน" }).click();
    await page.getByText("ผู้ซื้อ : Thanutham Supphaphon").first().click();
    await page.getByText("คอร์สที่ซื้อ : Essential CSS").click();
    await page.getByRole("button", { name: "ตรวจสอบการชำระ" }).click();
    await page
      .getByText(
        "โปรดตรวจสอบสลิปนี้กับเงินว่าได้เข้าในบัญชีของคุณหรือไม่ โปรดตรวจสอบให้แน่ใจก่อนท"
      )
      .click();
    await page.getByRole("button", { name: "อนุมัติ", exact: true }).click();
    await page.getByRole("button").filter({ hasText: /^$/ }).click();
    await page.getByText("Thanutham Supphaphon", { exact: true }).click();
    await page.getByText("คอร์ส Essential CSS for Web").nth(1).click();
    await page.getByRole("button", { name: "Close panel" }).click();
  });

  // only one time
  test("User : Can Search Admin and Send Chat to Admin", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" })
      .fill("user");
    await page.getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" })
      .fill("123456");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("button").filter({ hasText: /^$/ }).click();
    await page.getByRole("textbox", { name: "ค้นหา" }).click();
    await page.getByRole("textbox", { name: "ค้นหา" }).fill("Admin");
    await page.getByText("[Admin] Admin Gangmak").click();
    await page.getByRole("textbox", { name: "Type your message..." }).click();
    await page
      .getByRole("textbox", { name: "Type your message..." })
      .fill("SeadAdmin_TEST");
    await page.getByRole("button", { name: "Send" }).click();
    await page
      .getByRole("heading", { name: "แชทกับ Admin Gangmak" })
      .getByRole("button")
      .click();
    await expect(
      page.getByRole("heading", { name: "Admin Gangmak" })
    ).toBeVisible();
    await page.getByText("HelloAdmin_TEST").nth(1).click();
  });

  // only one time
  test("Admin : Can Search User and Send Chat to User", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" })
      .fill("admin");
    await page.getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" })
      .fill("123456");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("button").filter({ hasText: /^$/ }).click();
    await page.getByRole("textbox", { name: "ค้นหา" }).click();
    await page.getByRole("textbox", { name: "ค้นหา" }).fill("User");
    await page.getByText("[User] Zerza User").click();
    await page.getByRole("textbox", { name: "Type your message..." }).click();
    await page
      .getByRole("textbox", { name: "Type your message..." })
      .fill("HelloUser_TEST");
    await page.getByRole("button", { name: "Send" }).click();
    await page
      .getByRole("heading", { name: "แชทกับ Zerza User" })
      .getByRole("button")
      .click();
    await page.getByText("Zerza User").nth(1).click();
    await page.getByText("HelloUser_TEST").click();
  });

  // only one time
  test("Lecturer : Can Search User and Send Chat to User", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่ชื่อผู้ใช้งาน" })
      .fill("lecturer");
    await page.getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" }).click();
    await page
      .getByRole("textbox", { name: "กรุณาใส่รหัสผ่าน" })
      .fill("123456");
    await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
    await page.getByRole("button").filter({ hasText: /^$/ }).click();
    await page.getByRole("textbox", { name: "ค้นหา" }).click();
    await page.getByRole("textbox", { name: "ค้นหา" }).fill("User");
    await page.getByText("[User] Zerza User").click();
    await page.getByRole("textbox", { name: "Type your message..." }).click();
    await page
      .getByRole("textbox", { name: "Type your message..." })
      .fill("HelloStudent_TEST");
    await page.getByRole("button", { name: "Send" }).click();
    await page
      .getByRole("heading", { name: "แชทกับ Zerza User" })
      .getByRole("button")
      .click();
    await page.getByText("Zerza User").click();
    await page.getByText("HelloStudent_TEST").click();
  });
});
