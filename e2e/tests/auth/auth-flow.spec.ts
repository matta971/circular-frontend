import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('CLIENT authenticated flow', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
  });

  test('can access profile page', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/profile');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('can access wallet page', async ({ page }) => {
    await page.goto('/wallet', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/wallet');
  });

  test('can access collection list', async ({ page }) => {
    await page.goto('/collection', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/collection');
  });

  test('can access tokens page', async ({ page }) => {
    await page.goto('/tokens', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/tokens');
  });

  test('can access marketplace listings', async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/marketplace');
  });

  test('can access marketplace sell page', async ({ page }) => {
    await page.goto('/marketplace/sell', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/marketplace/sell');
  });

  test('can access notifications', async ({ page }) => {
    await page.goto('/notifications', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/notifications');
  });

  test('can access evaluation page', async ({ page }) => {
    await page.goto('/evaluation/my-evaluations', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/evaluation');
  });

  test('cannot access admin dashboard — redirected', async ({ page }) => {
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/admin');
  });

  test('cannot access ops dashboard — redirected', async ({ page }) => {
    await page.goto('/ops/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/ops');
  });
});
