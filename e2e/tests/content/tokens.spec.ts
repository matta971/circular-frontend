import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('Tokens page content', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
    await page.goto('/tokens', { waitUntil: 'domcontentloaded' });
    await page.locator('.tokens-page').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders page header with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Mes Tokens Circular');
  });

  test('token balance component is visible', async ({ page }) => {
    await expect(page.locator('app-token-balance')).toBeVisible();
  });

  test('quick actions card has 3 buttons', async ({ page }) => {
    const quickActions = page.locator('.quick-actions-card');
    await expect(quickActions).toBeVisible();
    await expect(quickActions.locator('.actions-list button')).toHaveCount(3);
  });

  test('quick actions show expected labels', async ({ page }) => {
    const quickActions = page.locator('.quick-actions-card');
    await expect(quickActions.getByText('Évaluer un appareil')).toBeVisible();
    await expect(quickActions.getByText('Échanger des tokens')).toBeVisible();
    await expect(quickActions.getByText("Voir l'historique")).toBeVisible();
  });

  test('recent transactions card is visible', async ({ page }) => {
    await expect(page.locator('.recent-transactions-card')).toBeVisible();
  });

  test('active vouchers card is visible', async ({ page }) => {
    await expect(page.locator('.active-vouchers-card')).toBeVisible();
  });

  test('how it works section has 4 steps', async ({ page }) => {
    const howItWorks = page.locator('.how-it-works');
    await expect(howItWorks).toBeVisible();
    await expect(howItWorks.locator('.step')).toHaveCount(4);
  });
});
