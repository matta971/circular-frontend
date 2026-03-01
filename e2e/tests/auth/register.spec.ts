import { test, expect } from '@playwright/test';

test.describe('Register page – /auth/register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register', { waitUntil: 'domcontentloaded' });
  });

  test('form renders with all required fields', async ({ page }) => {
    await expect(page.locator('input[formcontrolname="firstName"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="lastName"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="email"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="phone"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="password"]')).toBeVisible();
  });

  test('submit empty form shows validation errors', async ({ page }) => {
    // Use focus/blur to trigger Angular validation
    const fields = ['firstName', 'lastName', 'email', 'password'];
    for (const field of fields) {
      const input = page.locator(`input[formcontrolname="${field}"]`);
      await input.focus();
      await input.blur();
    }

    await expect(page.locator('mat-error').filter({ hasText: /Prénom requis/i })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('mat-error').filter({ hasText: /^Nom requis/i })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('mat-error').filter({ hasText: /Email requis/i })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('mat-error').filter({ hasText: /Mot de passe requis/i })).toBeVisible({ timeout: 5000 });
  });

  test('"Déjà un compte ?" link points to /auth/login', async ({ page }) => {
    const link = page.locator('a[routerlink="/auth/login"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/auth/login');
    await expect(page.getByText('Déjà un compte ?')).toBeVisible();
  });

  test('form is interactive – can type in all fields', async ({ page }) => {
    const firstName = page.locator('input[formcontrolname="firstName"]');
    const lastName = page.locator('input[formcontrolname="lastName"]');
    const email = page.locator('input[formcontrolname="email"]');
    const phone = page.locator('input[formcontrolname="phone"]');
    const password = page.locator('input[formcontrolname="password"]');

    await firstName.fill('Jean');
    await lastName.fill('Dupont');
    await email.fill('jean.dupont@example.com');
    await phone.fill('+33612345678');
    await password.fill('SecurePass123!');

    await expect(firstName).toHaveValue('Jean');
    await expect(lastName).toHaveValue('Dupont');
    await expect(email).toHaveValue('jean.dupont@example.com');
    await expect(phone).toHaveValue('+33612345678');
    await expect(password).toHaveValue('SecurePass123!');
  });
});
