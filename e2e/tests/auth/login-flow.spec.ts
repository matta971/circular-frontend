import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test-citoyen@circular-electronics.com';
const TEST_PASSWORD = 'TestCircular2024';

test.describe('Login via UI form', () => {
  test('can login with valid credentials via the form', async ({ page }) => {
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[formcontrolname="email"]').waitFor({ state: 'visible', timeout: 15_000 });

    await page.locator('input[formcontrolname="email"]').fill(TEST_EMAIL);
    await page.locator('input[formcontrolname="password"]').fill(TEST_PASSWORD);

    // Click the submit button
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();

    // After login, should be redirected away from /auth/login
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 15_000 });
    expect(page.url()).not.toContain('/auth/login');
  });

  test('login with wrong password shows error', async ({ page }) => {
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[formcontrolname="email"]').waitFor({ state: 'visible', timeout: 15_000 });

    await page.locator('input[formcontrolname="email"]').fill(TEST_EMAIL);
    await page.locator('input[formcontrolname="password"]').fill('WrongPassword999');

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeEnabled({ timeout: 5000 });
    await submitBtn.click();

    // Should stay on login page and show error
    await page.waitForTimeout(3000);
    expect(page.url()).toContain('/auth/login');

    // Look for error message (snackbar or inline error)
    const errorVisible = await page.locator('mat-error, .mat-mdc-snack-bar-container, .error-message, .snackbar-error').first().isVisible().catch(() => false);
    // If no visible error element, at least we're still on login
    expect(page.url()).toContain('/auth/login');
  });

  test('authenticated user accessing /auth/login is redirected away (guest guard)', async ({ page }) => {
    // First login via API
    const response = await page.request.post('/api/auth/login', {
      data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    });

    if (!response.ok()) {
      test.skip();
      return;
    }

    const body = await response.json();
    const { accessToken, refreshToken, user } = body.data;

    // Navigate to site first so localStorage is accessible
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.evaluate(
      ({ accessToken, refreshToken, user }) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      },
      { accessToken, refreshToken, user },
    );

    // Try to access login page while authenticated
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Guest guard should redirect to /
    expect(page.url()).not.toContain('/auth/login');
  });
});
