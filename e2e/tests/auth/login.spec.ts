import { test, expect } from '@playwright/test';

test.describe('Login page – /auth/login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    // Wait for Angular to render the login form
    await page.locator('input[formcontrolname="email"]').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('form renders with email and password input fields', async ({ page }) => {
    const emailInput = page.locator('input[formcontrolname="email"]');
    const passwordInput = page.locator('input[formcontrolname="password"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('Google OAuth button is visible', async ({ page }) => {
    const googleBtn = page.locator('button.google-btn');
    await expect(googleBtn).toBeVisible();
    await expect(googleBtn).toContainText('Continuer avec Google');
  });

  test('submit empty form shows validation errors', async ({ page }) => {
    const emailInput = page.locator('input[formcontrolname="email"]');
    const passwordInput = page.locator('input[formcontrolname="password"]');

    // Use focus/blur to trigger Angular touched validation
    await emailInput.focus();
    await emailInput.blur();
    await passwordInput.focus();
    await passwordInput.blur();

    await expect(page.getByText('Email requis')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Mot de passe requis')).toBeVisible({ timeout: 5000 });
  });

  test('enter invalid email shows email error', async ({ page }) => {
    const emailInput = page.locator('input[formcontrolname="email"]');

    await emailInput.fill('not-an-email');
    await emailInput.blur();

    await expect(page.getByText('Email invalide')).toBeVisible({ timeout: 5000 });
  });

  test('enter valid email but no password shows password error', async ({ page }) => {
    const emailInput = page.locator('input[formcontrolname="email"]');
    const passwordInput = page.locator('input[formcontrolname="password"]');

    await emailInput.fill('user@example.com');
    await passwordInput.focus();
    await passwordInput.blur();

    await expect(page.getByText('Mot de passe requis')).toBeVisible({ timeout: 5000 });
  });

  test('password visibility toggle works', async ({ page }) => {
    const passwordInput = page.locator('input[formcontrolname="password"]');
    const toggleBtn = page.locator('button[matsuffix]');

    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Use force: true because the button can be obscured by the fixed toolbar
    await toggleBtn.click({ force: true });
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await toggleBtn.click({ force: true });
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
