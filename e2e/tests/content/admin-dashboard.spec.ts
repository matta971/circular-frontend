import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('Admin dashboard content', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'admin');
    if (!ok) test.skip();
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await page.locator('.dashboard').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders dashboard title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Tableau de bord');
  });

  test('KPI grid has 4 cards', async ({ page }) => {
    await expect(page.locator('.kpi-grid')).toBeVisible();
    await expect(page.locator('.kpi-card')).toHaveCount(4);
  });

  test('KPI cards show expected labels', async ({ page }) => {
    await expect(page.getByText("Collectes aujourd'hui")).toBeVisible();
    await expect(page.getByText('Appareils ce mois')).toBeVisible();
    await expect(page.getByText('Nouveaux utilisateurs')).toBeVisible();
    await expect(page.getByText('Valeur recyclée')).toBeVisible();
  });

  test('recent collections table is visible', async ({ page }) => {
    const tableCard = page.locator('.table-card');
    await expect(tableCard).toBeVisible();
    await expect(page.getByText('Collectes récentes')).toBeVisible();
    await expect(page.locator('table[mat-table]')).toBeVisible();
  });

  test('alerts card is visible', async ({ page }) => {
    await expect(page.locator('.alerts-card')).toBeVisible();
    await expect(page.getByText('Alertes')).toBeVisible();
  });

  test('activity chart is visible', async ({ page }) => {
    await expect(page.locator('.activity-card')).toBeVisible();
    await expect(page.getByText('Activité des 7 derniers jours')).toBeVisible();
  });
});
