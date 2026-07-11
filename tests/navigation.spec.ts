import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  test("home redirects to default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("work index lists projects and opens a case study", async ({ page }) => {
    await page.goto("/en/work");
    await expect(page.getByRole("heading", { name: "Work", level: 1, exact: true })).toBeVisible();
    await page.getByRole("link", { name: /Open case study/i }).first().click();
    await expect(page).toHaveURL(/\/en\/work\/.+/);
  });

  test("about page opens", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.getByRole("heading", { name: "Serhii Tarasiuk" })).toBeVisible();
  });

  test("contact page still exists as a direct route", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page).toHaveURL(/\/en\/contact$/);
    await expect(page.getByRole("heading", { name: "Have a hard idea? Good." })).toBeVisible();
  });

  test("header Connect pops open Telegram/Email/Twitter without navigating away", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("link", { name: "Telegram" })).toHaveCount(0);

    await page.getByRole("button", { name: "Connect", exact: true }).click();
    await expect(page.getByRole("link", { name: "Telegram" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Twitter" })).toBeVisible();
    await expect(page).toHaveURL(/\/en$/);
  });

  test("language switch moves between en and uk without 404", async ({ page }) => {
    await page.goto("/en/work");
    await page.getByRole("button", { name: "Українська" }).click();
    await expect(page).toHaveURL(/\/uk\/work$/);
  });

  test("unknown route renders the custom 404", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("link", { name: /Back home/i })).toBeVisible();
  });
});
