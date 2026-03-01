import { test, expect } from '@playwright/test';

const redirects = [
  { from: '/actors/individuals', to: '/citoyen' },
  { from: '/actors/associations', to: '/association' },
  { from: '/actors/companies', to: '/entreprise' },
  { from: '/actors/communities', to: '/entreprise' },
  { from: '/contact/institutional', to: '/contact' },
  // Catch-all ** redirects to '' which resolves to home (may further redirect)
  { from: '/nonexistent-page-xyz', to: '/citoyen' },
];

test.describe('Route redirects', () => {
  for (const { from, to } of redirects) {
    test(`${from} redirects to ${to}`, async ({ page }) => {
      await page.goto(from, { waitUntil: 'domcontentloaded' });

      // Wait for Angular client-side redirect to complete
      await page.waitForURL(`**${to}`, { timeout: 10_000 });

      const url = new URL(page.url());
      expect(url.pathname).toBe(to);
    });
  }
});
