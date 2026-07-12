import { test, expect } from "@playwright/test";

const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`no horizontal overflow at ${vp.name} on home`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/en");
    await page.waitForTimeout(1000);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test(`no horizontal overflow at ${vp.name} on a case study`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/en/work/foody");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
}

test("hero canvas mounts and reports no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/en");
  await page.waitForTimeout(2000);
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("reduced motion still allows world switching", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await page.waitForTimeout(500);
  // WorldSwitchHeaderNav now renders twice (mobile row + desktop-centered column, same
  // dual-render-by-breakpoint pattern this codebase already uses for HeroGridScrollBar/FlagIcon).
  // A raw attribute selector matches both DOM copies regardless of which is `display:none` at the
  // current viewport, and `.first()` picks by DOM order, not visibility — coincidentally the
  // mobile (hidden, at this test's default desktop viewport) copy. `getByRole` is accessibility-
  // tree-aware and excludes hidden elements, same as the other header tests in this suite already
  // rely on.
  const first = await page.getByRole("button", { name: "Previous world" }).isVisible();
  expect(first).toBe(true);
});
