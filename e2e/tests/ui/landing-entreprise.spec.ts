import { test, expect } from '@playwright/test';

test.describe('Landing Entreprise Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/entreprise', { waitUntil: 'domcontentloaded' });
  });

  test('h1 contains "conformité" or "confiance"', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const text = (await h1.textContent()) ?? '';
    const hasExpectedText =
      text.toLowerCase().includes('conformité') ||
      text.toLowerCase().includes('confiance');
    expect(hasExpectedText, `h1 text "${text}" should contain "conformité" or "confiance"`).toBeTruthy();
  });

  test('regulation badges are visible (REP, DEEE, RSE)', async ({ page }) => {
    const expectedBadges = ['REP', 'DEEE', 'RSE'];

    for (const badge of expectedBadges) {
      const badgeElement = page.locator('.badge, .regulation-badge, .tag, .chip').filter({
        hasText: new RegExp(badge, 'i'),
      });
      await expect(
        badgeElement.first(),
        `Should find a badge containing "${badge}"`,
      ).toBeVisible();
    }
  });

  test('solution section has 4 features', async ({ page }) => {
    const solutionSection = page.locator('section.section-solution');
    await expect(solutionSection).toBeVisible();

    const features = solutionSection.locator('.feature');
    await expect(features).toHaveCount(4);
  });

  test('target section is visible', async ({ page }) => {
    const targetSection = page.locator('section.section-target');
    await expect(targetSection).toBeVisible();

    // Check the h2 heading
    const heading = targetSection.locator('h2');
    await expect(heading).toContainText('Pour qui');
  });

  test('"Pourquoi Circular Electronics" section exists', async ({ page }) => {
    const whySection = page.locator('h2', { hasText: /Pourquoi Circular/i });
    await expect(whySection.first()).toBeVisible();
  });

  test('CTA button linking to /auth/register exists', async ({ page }) => {
    const registerLinks = page.locator('a[href="/auth/register"], a[href*="register"]');
    await expect(registerLinks.first()).toBeVisible();
  });

  test('CTA button linking to /contact exists', async ({ page }) => {
    const contactLinks = page.locator('a[href="/contact"], a[href*="contact"]');
    await expect(contactLinks.first()).toBeVisible();
  });
});
