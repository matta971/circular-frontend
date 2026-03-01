import { test, expect } from '@playwright/test';

test.describe('Contact Form Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  });

  test('form renders with all required fields', async ({ page }) => {
    // Wait for Angular to render the form
    await expect(page.locator('input[formcontrolname="name"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="email"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="company"]')).toBeVisible();
    await expect(page.locator('mat-select[formcontrolname="subject"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="phone"]')).toBeVisible();
    await expect(page.locator('textarea[formcontrolname="message"]')).toBeVisible();
  });

  test('submit empty form shows validation errors', async ({ page }) => {
    // Wait for form to render
    const nameField = page.locator('input[formcontrolname="name"]');
    await expect(nameField).toBeVisible();

    // Touch and blur required fields to trigger validation
    await nameField.click();
    await nameField.blur();

    const emailField = page.locator('input[formcontrolname="email"]');
    await emailField.click();
    await emailField.blur();

    const messageField = page.locator('textarea[formcontrolname="message"]');
    await messageField.click();
    await messageField.blur();

    // Check that mat-error elements appear
    const matErrors = page.locator('mat-error');
    await expect(matErrors.first()).toBeVisible({ timeout: 5000 });
  });

  test('country flag selector opens dropdown', async ({ page }) => {
    // The phonePrefix is a mat-select
    const phonePrefix = page.locator('mat-select[formcontrolname="phonePrefix"]');
    await expect(phonePrefix).toBeVisible();
    await phonePrefix.click();

    // Verify dropdown opens with options
    const options = page.locator('mat-option');
    await expect(options.first()).toBeVisible({ timeout: 5000 });

    const count = await options.count();
    expect(count, 'Country dropdown should have options').toBeGreaterThan(0);

    // Close dropdown
    await page.keyboard.press('Escape');
  });

  test('fill form with valid data and verify submit button becomes enabled', async ({ page }) => {
    // Wait for form to render
    await expect(page.locator('input[formcontrolname="name"]')).toBeVisible();

    await page.locator('input[formcontrolname="name"]').fill('Jean Dupont');
    await page.locator('input[formcontrolname="email"]').fill('jean.dupont@example.com');
    await page.locator('input[formcontrolname="company"]').fill('Entreprise Test');

    // Select subject (mat-select)
    await page.locator('mat-select[formcontrolname="subject"]').click();
    await page.locator('mat-option').first().click();

    await page.locator('input[formcontrolname="phone"]').fill('0612345678');
    await page.locator('textarea[formcontrolname="message"]').fill('Ceci est un message de test.');

    // Verify submit button is enabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
  });
});
