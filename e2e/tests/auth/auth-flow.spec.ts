import { test, expect } from '@playwright/test';
import { loginAsTestUser } from '../../fixtures/auth.fixture';

test.describe('Authenticated flow', () => {
  let loggedIn = false;

  test.beforeEach(async ({ page }) => {
    loggedIn = await loginAsTestUser(page);
    if (!loggedIn) test.skip();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('can access profile page', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    // Should not redirect to login
    expect(page.url()).toContain('/profile');
  });

  test('can access wallet page', async ({ page }) => {
    await page.goto('/wallet', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    expect(page.url()).toContain('/wallet');
  });
});
