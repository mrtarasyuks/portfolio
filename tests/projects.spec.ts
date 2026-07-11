import { test, expect } from "@playwright/test";

test.describe("orbit worlds", () => {
  test("switching worlds swaps the front project card", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(1500);

    // The right-side panel is a looping marquee (the project list is duplicated for a seamless
    // loop), so each title can legitimately appear twice at once — assert on the first match.
    // Developer world now carries both Foody and the AI Video Production System.
    await expect(page.getByText("Foody", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("AI Video System", { exact: true }).first()).toBeVisible();

    await page.getByRole("tab", { name: "3D" }).click();
    await page.waitForTimeout(1200);
    await expect(page.getByText("3D Lab", { exact: true }).first()).toBeVisible();

    // Video Creator has no case-study projects of its own (genres/categories only) — its drum
    // carousel falls back to numbered placeholder slots.
    await page.getByRole("tab", { name: "Video Creator" }).click();
    await page.waitForTimeout(1200);
    await expect(page.getByText("Block 1", { exact: true }).first()).toBeVisible();
  });

  test("header prev/next arrows cycle worlds", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(1500);
    await expect(page.getByRole("tab", { name: "Developer", exact: true })).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "Next world" }).click();
    await page.waitForTimeout(1200);
    await expect(page.getByRole("tab", { name: "3D", exact: true })).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "Previous world" }).click();
    await page.waitForTimeout(1200);
    await expect(page.getByRole("tab", { name: "Developer", exact: true })).toHaveAttribute("aria-selected", "true");
  });

  test("arrow keys cycle worlds circularly", async ({ page }) => {
    await page.goto("/en");
    await page.waitForTimeout(1500);

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(1200);
    await expect(page.getByRole("tab", { name: "Video Creator", exact: true })).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(1200);
    await expect(page.getByRole("tab", { name: "Developer", exact: true })).toHaveAttribute("aria-selected", "true");
  });

  test("world-switch nav is only on the homepage", async ({ page }) => {
    await page.goto("/en/about");
    await page.waitForTimeout(500);
    await expect(page.getByRole("button", { name: "Next world" })).toHaveCount(0);
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

test.describe("world galleries", () => {
  for (const world of ["3d", "video", "developers"]) {
    test(`/work/${world} renders its gallery`, async ({ page }) => {
      const response = await page.goto(`/en/work/${world}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    });
  }
});
