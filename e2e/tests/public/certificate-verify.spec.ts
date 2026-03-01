import { test, expect } from '@playwright/test';

test.describe('Certificate verify page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/certificates/verify', { waitUntil: 'domcontentloaded' });
    await page.locator('.verify-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders verify card with title', async ({ page }) => {
    const verifyCard = page.locator('.verify-card');
    await expect(verifyCard).toBeVisible();
    await expect(page.getByText('Vérifier un certificat')).toBeVisible();
  });

  test('certificate input has correct placeholder', async ({ page }) => {
    await expect(page.locator('input[placeholder="CERT-XXXX-XXXX-XXXX"]')).toBeVisible();
  });

  test('verify button is disabled when input is empty', async ({ page }) => {
    const verifyBtn = page.locator('button').filter({ hasText: 'Vérifier' });
    await expect(verifyBtn).toBeVisible();
    await expect(verifyBtn).toBeDisabled();
  });

  test('info card explains how it works with 3 steps', async ({ page }) => {
    const infoCard = page.locator('.info-card');
    await expect(infoCard).toBeVisible();
    await expect(page.getByText('Comment ça marche')).toBeVisible();
    await expect(page.locator('.info-step')).toHaveCount(3);
  });

  test('info steps have expected content', async ({ page }) => {
    await expect(page.getByText('Trouvez le numéro')).toBeVisible();
    await expect(page.getByText('Entrez le numéro', { exact: true })).toBeVisible();
    await expect(page.getByText('Vérification instantanée')).toBeVisible();
  });
});
