import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('hero section is visible with h1 text', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).not.toBeEmpty();
  });

  test('section headings are visible', async ({ page }) => {
    // Wait for Angular to render at least one h2
    const firstH2 = page.locator('h2').first();
    await expect(firstH2).toBeVisible();

    const headings = page.locator('h2');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(headings.nth(i)).toBeVisible();
      await expect(headings.nth(i)).not.toBeEmpty();
    }
  });

  test('CTA buttons exist and have href attributes', async ({ page }) => {
    const ctaButtons = page.locator('a[href]').filter({ hasText: /.+/ });
    await expect(ctaButtons.first()).toBeVisible();

    const count = await ctaButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('no broken images', async ({ page }) => {
    // Wait for page to fully load including images
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth,
        );
        const src = await img.getAttribute('src');
        expect(naturalWidth, `Image "${src}" should have loaded (naturalWidth > 0)`).toBeGreaterThan(0);
      }
    }
  });
});
