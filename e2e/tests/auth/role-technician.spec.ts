import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('TECHNICIAN role access', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'technician');
    if (!ok) test.skip();
  });

  test('can access ops dashboard', async ({ page }) => {
    await page.goto('/ops/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/ops/dashboard');
  });

  test('can access ops to-receive page', async ({ page }) => {
    await page.goto('/ops/to-receive', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/ops/to-receive');
  });

  test('can access ops devices page', async ({ page }) => {
    await page.goto('/ops/devices', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/ops/devices');
  });

  test('can access ops finalization page', async ({ page }) => {
    await page.goto('/ops/finalization', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/ops/finalization');
  });

  test('can access ops certificates page', async ({ page }) => {
    await page.goto('/ops/certificates', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/ops/certificates');
  });

  test('cannot access admin dashboard — redirected', async ({ page }) => {
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/admin');
  });

  test('can still access common authenticated pages', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/profile');
  });
});
