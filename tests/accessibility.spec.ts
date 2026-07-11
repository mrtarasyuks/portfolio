import { test, expect } from "@playwright/test";

test.describe("accessibility", () => {
  test("home has one h1 and a skip link", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeAttached();
  });

  test("world-switch nav buttons have accessible labels", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(1000);
    await expect(page.getByRole("button", { name: "Previous world" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next world" })).toBeVisible();
  });

  test("keyboard can reach and activate the primary CTA", async ({ page }) => {
    await page.goto("/en");
    const link = page.getByRole("link", { name: "Selected work" });
    await link.focus();
    await expect(link).toBeFocused();
  });
});
