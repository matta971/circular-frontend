import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('Collection list page', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
    await page.goto('/collection', { waitUntil: 'domcontentloaded' });
    await page.locator('.collection-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders collection container with header', async ({ page }) => {
    await expect(page.locator('.collection-container h1')).toContainText('collecte');
  });

  test('new collection button is present', async ({ page }) => {
    await expect(page.locator('button').filter({ hasText: 'Nouvelle collecte' })).toBeVisible();
  });

  test('shows empty state or collection cards', async ({ page }) => {
    await page.waitForTimeout(3000);
    const emptyState = page.locator('.empty-state');
    const cards = page.locator('.collection-card');
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    const hasCards = await cards.first().isVisible().catch(() => false);
    expect(hasEmpty || hasCards).toBeTruthy();

    if (hasEmpty) {
      await expect(page.getByText('Aucune collecte')).toBeVisible();
      await expect(page.locator('button').filter({ hasText: 'Planifier une collecte' })).toBeVisible();
    }
  });
});

test.describe('Collection new page — stepper', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
    await page.goto('/collection/new', { waitUntil: 'domcontentloaded' });
    await page.locator('.collection-new-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders stepper with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Planifier une collecte');
    await expect(page.locator('.subtitle')).toBeVisible();
    await expect(page.locator('mat-stepper')).toBeVisible();
  });

  test('step 1 — device form fields are present', async ({ page }) => {
    await expect(page.locator('mat-select[formcontrolname="deviceType"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="brand"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="model"]')).toBeVisible();
    await expect(page.locator('mat-select[formcontrolname="condition"]')).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Ajouter' })).toBeVisible();
  });

  test('step 1 — device type dropdown has options', async ({ page }) => {
    await page.locator('mat-select[formcontrolname="deviceType"]').click({ force: true });
    const options = page.locator('mat-option');
    await expect(options.first()).toBeVisible({ timeout: 5000 });
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(8);
    await page.keyboard.press('Escape');
  });

  test('step 1 — condition dropdown has options', async ({ page }) => {
    await page.locator('mat-select[formcontrolname="condition"]').click({ force: true });
    await expect(page.locator('mat-option').filter({ hasText: 'Neuf' })).toBeVisible();
    await expect(page.locator('mat-option').filter({ hasText: 'Bon' })).toBeVisible();
    await expect(page.locator('mat-option').filter({ hasText: 'Correct' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('continue button on step 1 is disabled without devices', async ({ page }) => {
    const continueBtn = page.locator('button[matsteppernext]').filter({ hasText: 'Continuer' }).first();
    await expect(continueBtn).toBeDisabled();
  });

  test('step labels are correct', async ({ page }) => {
    await expect(page.getByText('Vos appareils', { exact: true })).toBeVisible();
    await expect(page.getByText('Adresse de collecte', { exact: true })).toBeVisible();
    await expect(page.getByText('Date et créneau', { exact: true })).toBeVisible();
    await expect(page.getByText('Confirmation', { exact: true })).toBeVisible();
  });
});
