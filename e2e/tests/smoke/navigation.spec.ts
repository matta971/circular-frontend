import { test, expect } from '@playwright/test';

test.describe('Footer navigation', () => {
  test('all footer links navigate correctly', async ({ page }) => {
    await page.goto('/about/mission', { waitUntil: 'domcontentloaded' });

    // In rendered DOM, Angular compiles routerLink to href
    const footerLinks = page.locator('app-footer a[href]');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(10);

    // Collect all hrefs
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      if (href) hrefs.push(href);
    }

    // Test each unique href
    const uniqueHrefs = [...new Set(hrefs)];
    for (const href of uniqueHrefs) {
      const response = await page.goto(href, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);
    }
  });
});

test.describe('Header navigation', () => {
  test('header has logo linking to home', async ({ page }) => {
    await page.goto('/citoyen', { waitUntil: 'domcontentloaded' });

    const logo = page.locator('app-public-header a.logo[href="/"]');
    await expect(logo).toBeVisible();
  });

  test('header has login button', async ({ page }) => {
    await page.goto('/citoyen', { waitUntil: 'domcontentloaded' });

    const loginLink = page.locator('app-public-header a[href="/auth/login"]');
    await expect(loginLink).toBeVisible();
  });

  test('header scroll links are present', async ({ page }) => {
    await page.goto('/citoyen', { waitUntil: 'domcontentloaded' });

    // Wait for Angular to render the nav links
    const navLinks = page.locator('app-public-header nav.nav-links a');
    await expect(navLinks.first()).toBeVisible({ timeout: 10_000 });

    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
