import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('ADMIN role access', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'admin');
    if (!ok) test.skip();
  });

  test('can access admin dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/dashboard');
  });

  test('can access admin collections', async ({ page }) => {
    await page.goto('/admin/collections', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/collections');
  });

  test('can access admin devices', async ({ page }) => {
    await page.goto('/admin/devices', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/devices');
  });

  test('can access admin users', async ({ page }) => {
    await page.goto('/admin/users', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/users');
  });

  test('can access admin repair partners', async ({ page }) => {
    await page.goto('/admin/repair-partners', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/repair-partners');
  });

  test('can access admin scoring rules', async ({ page }) => {
    await page.goto('/admin/scoring', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/scoring');
  });

  test('can access admin KPI dashboard', async ({ page }) => {
    await page.goto('/admin/kpis', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/kpis');
  });

  test('can access admin partner analytics', async ({ page }) => {
    await page.goto('/admin/partner-analytics', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/partner-analytics');
  });

  test('can access admin partner subscriptions', async ({ page }) => {
    await page.goto('/admin/partner-subscriptions', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/partner-subscriptions');
  });

  test('can access admin onboarding config', async ({ page }) => {
    await page.goto('/admin/onboarding', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/admin/onboarding');
  });

  test('can also access ops dashboard (admin has technician access)', async ({ page }) => {
    await page.goto('/ops/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/ops/dashboard');
  });

  test('can access common authenticated pages', async ({ page }) => {
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/profile');
  });
});
