import { test, expect } from '@playwright/test';

test.describe('Evaluation page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/evaluation', { waitUntil: 'domcontentloaded' });
    await page.locator('.evaluation-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders stepper component', async ({ page }) => {
    await expect(page.locator('mat-stepper')).toBeVisible();
  });

  test('step 1 shows device type category grid', async ({ page }) => {
    const categoryGrid = page.locator('.category-grid');
    await expect(categoryGrid).toBeVisible();
    const cards = categoryGrid.locator('.category-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('step labels are correct', async ({ page }) => {
    await expect(page.getByText("Type d'appareil")).toBeVisible();
    await expect(page.getByText("Informations de l'appareil")).toBeVisible();
    await expect(page.getByText("État de l'appareil")).toBeVisible();
  });

  test('continue button on step 1 is disabled without selection', async ({ page }) => {
    const continueBtn = page.locator('button').filter({ hasText: 'Continuer' }).first();
    await expect(continueBtn).toBeDisabled();
  });

  test('category cards have icons and labels', async ({ page }) => {
    const firstCard = page.locator('.category-card').first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('mat-icon')).toBeVisible();
    await expect(firstCard.locator('span')).toBeVisible();
  });
});
