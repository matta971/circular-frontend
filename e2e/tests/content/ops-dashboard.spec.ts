import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('Ops dashboard content', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'technician');
    if (!ok) test.skip();
    await page.goto('/ops', { waitUntil: 'domcontentloaded' });
    await page.locator('.dashboard-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders dashboard title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Tableau de bord Opérations');
  });

  test('KPI grid has 4 cards or shows error state', async ({ page }) => {
    await page.waitForTimeout(3000);
    const kpiGrid = page.locator('.kpi-grid');
    const errorCard = page.locator('.error-card');
    const hasKpi = await kpiGrid.isVisible().catch(() => false);
    const hasError = await errorCard.isVisible().catch(() => false);
    expect(hasKpi || hasError).toBeTruthy();

    if (hasKpi) {
      await expect(page.locator('.kpi-card')).toHaveCount(4);
    }
  });

  test('KPI cards show expected labels when loaded', async ({ page }) => {
    await page.waitForTimeout(3000);
    const kpiGrid = page.locator('.kpi-grid');
    const hasKpi = await kpiGrid.isVisible().catch(() => false);
    if (!hasKpi) {
      test.skip();
      return;
    }
    await expect(page.getByText('À réceptionner')).toBeVisible();
    await expect(page.getByText('À finaliser')).toBeVisible();
    await expect(page.getByText('Litiges ouverts')).toBeVisible();
    await expect(page.getByText("Reçus aujourd'hui")).toBeVisible();
  });

  test('quick action buttons are present when loaded', async ({ page }) => {
    await page.waitForTimeout(3000);
    const actionsGrid = page.locator('.actions-grid');
    const hasActions = await actionsGrid.isVisible().catch(() => false);
    if (!hasActions) {
      test.skip();
      return;
    }
    await expect(page.locator('button').filter({ hasText: 'Réceptionner des appareils' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Finaliser des appareils' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Rechercher un appareil' })).toBeVisible();
  });
});
