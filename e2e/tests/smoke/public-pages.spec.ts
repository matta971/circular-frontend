import { test, expect } from '@playwright/test';

const publicPages = [
  { path: '/', titleContains: 'Circular' },
  { path: '/citoyen', titleContains: 'Citoyen' },
  { path: '/association', titleContains: 'Association' },
  { path: '/entreprise', titleContains: 'Entreprise' },
  { path: '/contact', titleContains: 'Contact' },
  { path: '/about/mission', titleContains: 'Mission' },
  { path: '/about/vision', titleContains: 'Vision' },
  { path: '/about/governance', titleContains: 'Gouvernance' },
  { path: '/about/partners', titleContains: 'Partenaires' },
  { path: '/trust/traceability', titleContains: 'Tra' },
  { path: '/trust/rep-compliance', titleContains: 'Conformit' },
  { path: '/trust/methodology', titleContains: 'thodologie' },
  { path: '/trust/data-security', titleContains: 'curit' },
  { path: '/resources/blog', titleContains: 'Blog' },
  { path: '/resources/studies', titleContains: 'tudes' },
  { path: '/resources/press', titleContains: 'Presse' },
  { path: '/resources/faq', titleContains: 'FAQ' },
  { path: '/legal/terms', titleContains: 'Mentions' },
  { path: '/legal/privacy', titleContains: 'Confidentialit' },
  { path: '/auth/login', titleContains: 'Circular' },
  { path: '/auth/register', titleContains: 'Circular' },
];

test.describe('Public pages smoke tests', () => {
  for (const { path, titleContains } of publicPages) {
    test(`${path} loads correctly with title containing "${titleContains}"`, async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Ignore network errors (API calls, favicon, etc.)
          if (text.includes('Failed to load resource')) return;
          consoleErrors.push(text);
        }
      });

      await page.goto(path, { waitUntil: 'domcontentloaded' });

      await expect(page).toHaveTitle(new RegExp(titleContains, 'i'));

      await expect(page.locator('body')).toBeVisible();

      expect(consoleErrors, `JS errors found on ${path}: ${consoleErrors.join(', ')}`).toHaveLength(0);
    });
  }
});
