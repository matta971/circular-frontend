import { test, expect } from '@playwright/test';

const footerPages = [
  // About group - should have persona buttons
  { path: '/about/mission', group: 'about', crosslinkCount: 3 },
  { path: '/about/vision', group: 'about', crosslinkCount: 3 },
  { path: '/about/governance', group: 'about', crosslinkCount: 3 },
  { path: '/about/partners', group: 'about', crosslinkCount: 3 },
  // Trust group - should have dual CTA
  { path: '/trust/traceability', group: 'trust', crosslinkCount: 3 },
  { path: '/trust/rep-compliance', group: 'trust', crosslinkCount: 3 },
  { path: '/trust/methodology', group: 'trust', crosslinkCount: 3 },
  { path: '/trust/data-security', group: 'trust', crosslinkCount: 3 },
  // Resources group - should have dual CTA
  { path: '/resources/blog', group: 'resources', crosslinkCount: 3 },
  { path: '/resources/studies', group: 'resources', crosslinkCount: 3 },
  { path: '/resources/press', group: 'resources', crosslinkCount: 3 },
  { path: '/resources/faq', group: 'resources', crosslinkCount: 3 },
  // Legal group - should have home button
  { path: '/legal/terms', group: 'legal', crosslinkCount: 3 },
  { path: '/legal/privacy', group: 'legal', crosslinkCount: 3 },
] as const;

test.describe('Footer Pages - Cross-linking and CTAs', () => {
  for (const footerPage of footerPages) {
    test.describe(`${footerPage.path}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(footerPage.path, { waitUntil: 'domcontentloaded' });
      });

      test('"Pour aller plus loin" heading exists', async ({ page }) => {
        const heading = page.locator('h2, h3').filter({
          hasText: /Pour aller plus loin/i,
        });
        await expect(heading.first()).toBeVisible();
      });

      test(`has ${footerPage.crosslinkCount} crosslink cards`, async ({ page }) => {
        const crosslinkCards = page.locator('.crosslink-card');
        await expect(crosslinkCards).toHaveCount(footerPage.crosslinkCount);
      });

      test('each crosslink card has icon, title, and description', async ({ page }) => {
        // Wait for cards to render
        const crosslinkCards = page.locator('.crosslink-card');
        await expect(crosslinkCards.first()).toBeVisible();

        const count = await crosslinkCards.count();
        for (let i = 0; i < count; i++) {
          const card = crosslinkCards.nth(i);
          await expect(card.locator('mat-icon').first()).toBeVisible();
          await expect(card.locator('h3').first()).toBeVisible();
          await expect(card.locator('p').first()).toBeVisible();
        }
      });

      if (footerPage.group === 'about') {
        test('has 3 persona buttons', async ({ page }) => {
          const personaButtons = page.locator('.persona-btn');
          await expect(personaButtons).toHaveCount(3);
        });
      }

      if (footerPage.group === 'trust' || footerPage.group === 'resources') {
        test('has dual CTA section with 2 buttons', async ({ page }) => {
          const dualCta = page.locator('.dual-cta');
          await expect(dualCta).toBeVisible();

          const ctaButtons = dualCta.locator('a');
          await expect(ctaButtons).toHaveCount(2);
        });
      }

      if (footerPage.group === 'legal') {
        test('has home button', async ({ page }) => {
          const homeButton = page.locator('a[href="/"]');
          await expect(homeButton.first()).toBeVisible();
        });
      }
    });
  }
});
