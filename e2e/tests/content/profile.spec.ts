import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('Profile page content', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
    await page.goto('/profile', { waitUntil: 'domcontentloaded' });
    await page.locator('.profile-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders profile container with two cards', async ({ page }) => {
    await expect(page.locator('.profile-card')).toBeVisible();
    await expect(page.locator('.info-card')).toBeVisible();
  });

  test('avatar section shows user name and role chip', async ({ page }) => {
    const avatar = page.locator('.avatar-section');
    await expect(avatar).toBeVisible();
    await expect(avatar.locator('h1')).not.toBeEmpty();
    await expect(avatar.locator('.email')).toBeVisible();
    await expect(avatar.locator('mat-chip')).toBeVisible();
  });

  test('profile form renders all fields', async ({ page }) => {
    await expect(page.locator('input[formcontrolname="firstName"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="lastName"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="phone"]')).toBeVisible();
    await expect(page.locator('mat-select[formcontrolname="country"]')).toBeVisible();
    await expect(page.locator('mat-select[formcontrolname="preferredLanguage"]')).toBeVisible();
  });

  test('form has section headings', async ({ page }) => {
    await expect(page.getByText('Informations personnelles')).toBeVisible();
    await expect(page.getByText('Preferences')).toBeVisible();
  });

  test('info card shows account information', async ({ page }) => {
    const infoCard = page.locator('.info-card');
    await expect(infoCard).toBeVisible();
    await expect(infoCard.locator('.info-item')).toHaveCount(3);
    await expect(infoCard.getByText('Membre depuis')).toBeVisible();
    await expect(infoCard.getByText('Email')).toBeVisible();
    await expect(infoCard.getByText('Solde wallet')).toBeVisible();
  });

  test('save and cancel buttons are present', async ({ page }) => {
    await expect(page.locator('button[type="submit"]').filter({ hasText: 'Enregistrer' })).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'Annuler' })).toBeVisible();
  });

  test('country dropdown opens with options', async ({ page }) => {
    await page.locator('mat-select[formcontrolname="country"]').click();
    const options = page.locator('mat-option');
    await expect(options.first()).toBeVisible({ timeout: 5000 });
    const count = await options.count();
    expect(count).toBeGreaterThan(5);
    await page.keyboard.press('Escape');
  });

  test('disabled email field shows hint', async ({ page }) => {
    await expect(page.getByText("L'email ne peut pas")).toBeVisible();
  });
});
