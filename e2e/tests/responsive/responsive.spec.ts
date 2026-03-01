import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

const pages = [
  { path: '/', name: 'Home' },
  { path: '/citoyen', name: 'Citoyen' },
  { path: '/contact', name: 'Contact' },
  { path: '/about/mission', name: 'Mission' },
  { path: '/auth/login', name: 'Login' },
];

for (const viewport of viewports) {
  test.describe(`Responsive – ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const pg of pages) {
      test(`${pg.name} page renders correctly`, async ({ page }) => {
        await page.goto(pg.path, { waitUntil: 'domcontentloaded' });

        // Verify body is visible
        await expect(page.locator('body')).toBeVisible();

        // Verify no horizontal scrollbar (allow 5px tolerance for sub-pixel rounding)
        const hasNoOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth <= document.documentElement.clientWidth + 5;
        });
        expect(hasNoOverflow).toBe(true);

        // Verify a main heading is visible (h1, or fall back to any heading)
        const h1 = page.locator('h1').first();
        const heading = page.locator('h1, h2, h3, [class*="title"]').first();
        const target = (await h1.count()) > 0 ? h1 : heading;
        if ((await target.count()) > 0) {
          await expect(target).toBeVisible({ timeout: 5000 });
        }
      });

      if (viewport.name === 'mobile') {
        test(`${pg.name} – no content overflow on mobile`, async ({ page }) => {
          await page.goto(pg.path, { waitUntil: 'domcontentloaded' });

          // Check that no element overflows the viewport width
          const overflowingElements = await page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            const all = document.querySelectorAll('body *');
            let count = 0;
            for (const el of all) {
              const rect = el.getBoundingClientRect();
              // Allow 5px tolerance
              if (rect.right > vw + 5 && getComputedStyle(el).overflow !== 'hidden') {
                count++;
              }
            }
            return count;
          });

          expect(overflowingElements).toBe(0);
        });
      }
    }
  });
}
