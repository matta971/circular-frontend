import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('Wallet page content', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
    await page.goto('/wallet', { waitUntil: 'domcontentloaded' });
    await page.locator('.wallet-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders wallet container with header', async ({ page }) => {
    await expect(page.locator('.wallet-header h1')).toContainText('Wallet');
    await expect(page.locator('.wallet-header .greeting')).toContainText('Bonjour');
  });

  test('balance card is visible with amount', async ({ page }) => {
    const balanceCard = page.locator('.balance-card');
    await expect(balanceCard).toBeVisible();
    await expect(balanceCard.locator('.balance-content')).toBeVisible();
    await expect(balanceCard.locator('.label')).toContainText('Solde');
    await expect(balanceCard.locator('.amount')).toBeVisible();
  });

  test('stats grid has 4 stat cards', async ({ page }) => {
    await expect(page.locator('.stats-grid')).toBeVisible();
    await expect(page.locator('.stat-card')).toHaveCount(4);
  });

  test('stat cards show expected labels', async ({ page }) => {
    await expect(page.getByText('Total gagné')).toBeVisible();
    await expect(page.getByText('Appareils recyclés')).toBeVisible();
    await expect(page.getByText('Total retiré')).toBeVisible();
    await expect(page.getByText('En cours de traitement')).toBeVisible();
  });

  test('history card renders with tab group', async ({ page }) => {
    await expect(page.locator('.history-card')).toBeVisible();
    await expect(page.locator('mat-tab-group')).toBeVisible();
    await expect(page.getByRole('tab', { name: /Toutes/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /compenses/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Retraits/i })).toBeVisible();
  });

  test('transactions list or empty state is shown', async ({ page }) => {
    const transactions = page.locator('.transaction-item');
    const emptyState = page.locator('.empty-state');
    const hasTransactions = await transactions.first().isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    expect(hasTransactions || hasEmpty).toBeTruthy();
  });

  test('quick actions section renders 3 action cards', async ({ page }) => {
    await expect(page.locator('.quick-actions')).toBeVisible();
    await expect(page.locator('.quick-actions h2')).toContainText('Actions rapides');
    await expect(page.locator('.action-card')).toHaveCount(3);
  });

  test('withdraw button exists on balance card', async ({ page }) => {
    await expect(page.locator('.balance-card button').filter({ hasText: 'Retirer' })).toBeVisible();
  });
});
