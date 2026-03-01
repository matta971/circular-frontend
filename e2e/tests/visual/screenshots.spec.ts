import { test, expect } from '@playwright/test';

const screenshotPages = [
  { path: '/', name: 'home' },
  { path: '/citoyen', name: 'citoyen' },
  { path: '/association', name: 'association' },
  { path: '/entreprise', name: 'entreprise' },
  { path: '/contact', name: 'contact' },
  { path: '/about/mission', name: 'mission' },
  { path: '/trust/traceability', name: 'traceability' },
  { path: '/resources/faq', name: 'faq' },
  { path: '/legal/privacy', name: 'privacy' },
  { path: '/auth/login', name: 'login' },
];

test.describe('Visual regression – full-page screenshots', () => {
  for (const pg of screenshotPages) {
    test(`${pg.name} page matches screenshot`, async ({ page }) => {
      await page.goto(pg.path, { waitUntil: 'networkidle' });

      await expect(page).toHaveScreenshot(`${pg.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
