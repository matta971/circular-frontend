import { test, expect } from '@playwright/test';

test.describe('Landing Association Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/association', { waitUntil: 'domcontentloaded' });
  });

  test('h1 contains "visibilité" or "actions"', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    const text = (await h1.textContent()) ?? '';
    const hasExpectedText =
      text.toLowerCase().includes('visibilité') ||
      text.toLowerCase().includes('actions');
    expect(hasExpectedText, `h1 text "${text}" should contain "visibilité" or "actions"`).toBeTruthy();
  });

  test('reality section has 3 items', async ({ page }) => {
    const realitySection = page.locator('section.section-reality');
    await expect(realitySection).toBeVisible();

    const items = realitySection.locator('.reality-item');
    await expect(items).toHaveCount(3);
  });

  test('solution section has 4 features', async ({ page }) => {
    const solutionSection = page.locator('section.section-solution');
    await expect(solutionSection).toBeVisible();

    const features = solutionSection.locator('.feature');
    await expect(features).toHaveCount(4);
  });

  test('impact section has 3 cards with correct values', async ({ page }) => {
    const impactSection = page.locator('section.section-impact');
    await expect(impactSection).toBeVisible();

    const cards = impactSection.locator('.impact-card');
    await expect(cards).toHaveCount(3);

    // Verify specific stat values exist
    const expectedStats = ['+150%', '100%', '0\u20AC'];
    for (const stat of expectedStats) {
      await expect(
        impactSection.getByText(stat).first(),
        `Impact section should contain "${stat}"`,
      ).toBeVisible();
    }
  });

  test('"Comment \u00e7a marche" section has 4 steps', async ({ page }) => {
    const stepsSection = page.locator('section.section-steps');
    await expect(stepsSection).toBeVisible();

    const steps = stepsSection.locator('.step');
    await expect(steps).toHaveCount(4);
  });

  test('trust section has 4 items', async ({ page }) => {
    const trustSection = page.locator('section.section-trust');
    await expect(trustSection).toBeVisible();

    const items = trustSection.locator('.trust-item');
    await expect(items).toHaveCount(4);

    const expectedLabels = ['Gratuit', 'RGPD', 'Accompagnement', 'Impact mesurable'];
    for (const label of expectedLabels) {
      await expect(
        trustSection.getByText(label).first(),
        `Trust section should contain "${label}"`,
      ).toBeVisible();
    }
  });

  test('partnership section is visible', async ({ page }) => {
    const partnershipSection = page.locator('section.section-partnership');
    await expect(partnershipSection).toBeVisible();
  });

  test('final CTA links to /contact', async ({ page }) => {
    const contactLinks = page.locator('a[href="/contact"], a[href*="contact"]');
    await expect(contactLinks.first()).toBeVisible();
  });
});
