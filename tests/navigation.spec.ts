import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  test("home redirects to default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("work index lists projects and opens a case study", async ({ page }) => {
    await page.goto("/en/work");
    await expect(page.getByRole("heading", { name: "Selected work", exact: true })).toBeVisible();
    await page.getByRole("link", { name: /Open case study/i }).first().click();
    await expect(page).toHaveURL(/\/en\/work\/.+/);
  });

  test("about page opens", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.getByRole("heading", { name: "Serega Tarasyuk" })).toBeVisible();
  });

  test("language switch moves between en and uk without 404", async ({ page }) => {
    await page.goto("/en/work");
    await page.getByRole("button", { name: "uk" }).click();
    await expect(page).toHaveURL(/\/uk\/work$/);
  });

  test("unknown route renders the custom 404", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /Back home/i })).toBeVisible();
  });
});
