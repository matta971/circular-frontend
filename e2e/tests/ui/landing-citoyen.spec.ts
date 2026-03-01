import { test, expect } from '@playwright/test';

test.describe('Landing Citoyen Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/citoyen', { waitUntil: 'domcontentloaded' });
  });

  test('h1 contains "seconde vie" or "appareils"', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const text = (await h1.textContent()) ?? '';
    const hasExpectedText =
      text.toLowerCase().includes('seconde vie') ||
      text.toLowerCase().includes('appareils');
    expect(hasExpectedText, `h1 text "${text}" should contain "seconde vie" or "appareils"`).toBeTruthy();
  });

  test('sections exist with expected h2 headings', async ({ page }) => {
    const expectedKeywords = ['Recycler', 'plateforme', 'Circular', 'Comment ça marche', 'confiance'];

    for (const keyword of expectedKeywords) {
      const heading = page.locator('h2', { hasText: new RegExp(keyword, 'i') });
      await expect(
        heading.first(),
        `Should find an h2 containing "${keyword}"`,
      ).toBeVisible();
    }
  });

  test('benefits section has 4 cards', async ({ page }) => {
    const benefitsSection = page.locator('section.section-benefits');
    await expect(benefitsSection).toBeVisible();

    const cards = benefitsSection.locator('.benefit-card');
    await expect(cards).toHaveCount(4);
  });

  test('steps section has 4 steps', async ({ page }) => {
    const stepsSection = page.locator('section.section-steps');
    await expect(stepsSection).toBeVisible();

    const steps = stepsSection.locator('.step');
    await expect(steps).toHaveCount(4);
  });

  test('CTA buttons with link to /auth/register exist', async ({ page }) => {
    const registerLinks = page.locator('a[href="/auth/register"], a[href*="register"]');
    await expect(registerLinks.first()).toBeVisible();
  });

  test('"Comprendre le concept" button exists', async ({ page }) => {
    const button = page.locator('a, button').filter({ hasText: /Comprendre le concept/i });
    await expect(button.first()).toBeVisible();
  });
});
