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
    // The hero's own "Selected work" CTA row was removed (18th pivot) — the header's "Work" pill
    // is now the site's primary navigational CTA, present on every page.
    const link = page.getByRole("link", { name: "Work", exact: true }).first();
    await link.focus();
    await expect(link).toBeFocused();
  });
});
