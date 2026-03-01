import { test, expect } from '@playwright/test';

test.describe('Auth guards — unauthenticated access', () => {
  test('unauthenticated user accessing /profile is redirected to login', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/auth/login');
  });

  test('unauthenticated user accessing /wallet is redirected to login', async ({ page }) => {
    await page.goto('/wallet', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/auth/login');
  });

  test('unauthenticated user accessing /collection is redirected to login', async ({ page }) => {
    await page.goto('/collection', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/auth/login');
  });

  test('unauthenticated user accessing /tokens is redirected to login', async ({ page }) => {
    await page.goto('/tokens', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/auth/login');
  });

  test('unauthenticated user accessing /notifications is redirected to login', async ({ page }) => {
    await page.goto('/notifications', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/auth/login');
  });

  test('unauthenticated user accessing /admin/dashboard is redirected away', async ({ page }) => {
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // Admin guard redirects to / which may cascade to /citoyen or /auth/login
    expect(page.url()).not.toContain('/admin');
  });

  test('unauthenticated user accessing /ops/dashboard is redirected away', async ({ page }) => {
    await page.goto('/ops/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    // Technician guard redirects to / which may cascade to /citoyen or /auth/login
    expect(page.url()).not.toContain('/ops');
  });

  test('unauthenticated user accessing /marketplace/sell is redirected to login', async ({ page }) => {
    await page.goto('/marketplace/sell', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/auth/login');
  });

  test('public routes remain accessible without auth', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/marketplace');

    await page.goto('/evaluation', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/evaluation');

    await page.goto('/deposit', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/deposit');
  });
});
