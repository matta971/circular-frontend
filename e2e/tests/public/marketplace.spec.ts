import { test, expect } from '@playwright/test';

test.describe('Marketplace listings page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/marketplace', { waitUntil: 'domcontentloaded' });
    await page.locator('.marketplace-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders marketplace container with header', async ({ page }) => {
    await expect(page.locator('.marketplace-header h1')).toContainText('Marketplace');
    await expect(page.locator('.marketplace-header p')).toBeVisible();
  });

  test('sell button links to /marketplace/sell', async ({ page }) => {
    const sellBtn = page.locator('a').filter({ hasText: 'Vendre' });
    await expect(sellBtn).toBeVisible();
    await expect(sellBtn).toHaveAttribute('href', '/marketplace/sell');
  });

  test('filters section renders all dropdowns', async ({ page }) => {
    await expect(page.locator('.filters-section')).toBeVisible();
    await expect(page.locator('.filters-section input[placeholder*="iPhone"]')).toBeVisible();
    await expect(page.locator('.filters-section mat-select')).toHaveCount(3);
  });

  test('category dropdown has options', async ({ page }) => {
    const selects = page.locator('.filters-section mat-select');
    await selects.first().click();
    const options = page.locator('mat-option');
    await expect(options.first()).toBeVisible({ timeout: 5000 });
    const count = await options.count();
    expect(count).toBeGreaterThan(5);
    await page.keyboard.press('Escape');
  });

  test('sort dropdown has expected options', async ({ page }) => {
    const selects = page.locator('.filters-section mat-select');
    await selects.last().click();
    await expect(page.locator('mat-option').filter({ hasText: 'Plus récents' })).toBeVisible();
    await expect(page.locator('mat-option').filter({ hasText: 'Prix croissant' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('shows listings grid or empty state', async ({ page }) => {
    // Wait for loading to finish
    await page.waitForTimeout(3000);
    const grid = page.locator('.listings-grid');
    const empty = page.locator('.empty-state');
    const hasGrid = await grid.isVisible().catch(() => false);
    const hasEmpty = await empty.isVisible().catch(() => false);
    expect(hasGrid || hasEmpty).toBeTruthy();
  });

  test('if listings exist — cards have expected structure', async ({ page }) => {
    await page.waitForTimeout(3000);
    const card = page.locator('.listing-card').first();
    const hasCard = await card.isVisible().catch(() => false);
    if (!hasCard) {
      test.skip();
      return;
    }
    await expect(card.locator('.listing-image')).toBeVisible();
    await expect(card.locator('.listing-title')).toBeVisible();
    await expect(card.locator('.price')).toBeVisible();
  });

  test('paginator is present when listings exist', async ({ page }) => {
    await page.waitForTimeout(3000);
    const hasListings = await page.locator('.listing-card').first().isVisible().catch(() => false);
    if (!hasListings) {
      test.skip();
      return;
    }
    await expect(page.locator('mat-paginator')).toBeVisible();
  });
});
