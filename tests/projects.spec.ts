import { test, expect } from "@playwright/test";

test.describe("orbit worlds", () => {
  test("switching worlds swaps the front project card", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(1500);

    await expect(page.getByText("Foody", { exact: true })).toBeVisible();

    await page.getByRole("tab", { name: "3D" }).click();
    await page.waitForTimeout(1200);
    await expect(page.getByText("3D Lab", { exact: true })).toBeVisible();

    await page.getByRole("tab", { name: "Video Creator" }).click();
    await page.waitForTimeout(1200);
    await expect(page.getByText("AI Video System", { exact: true })).toBeVisible();
  });

  test("next/prev controls advance the active index", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(1500);
    await expect(page.getByText("01 / 03")).toBeVisible();
    await page.getByRole("button", { name: "Next project" }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText("02 / 03")).toBeVisible();
  });
});

test.describe("case studies", () => {
  for (const slug of ["foody", "ai-video-production", "3d-lab"]) {
    test(`/work/${slug} renders without error`, async ({ page }) => {
      const response = await page.goto(`/en/work/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});
