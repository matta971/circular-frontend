import { test, expect } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

test.describe('Notifications page content', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
    await page.goto('/notifications', { waitUntil: 'domcontentloaded' });
    await page.locator('.notifications-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders header with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Notifications');
  });

  test('shows unread count', async ({ page }) => {
    await expect(page.getByText('non lue(s)')).toBeVisible();
  });

  test('mark all as read button is present', async ({ page }) => {
    await expect(page.locator('button').filter({ hasText: 'Tout marquer comme lu' })).toBeVisible();
  });

  test('preferences link is present', async ({ page }) => {
    const prefLink = page.locator('a').filter({ hasText: 'Préférences' });
    await expect(prefLink).toBeVisible();
    await expect(prefLink).toHaveAttribute('href', '/notifications/preferences');
  });

  test('shows notification list or empty state', async ({ page }) => {
    await page.waitForTimeout(3000);
    const notifItems = page.locator('.notification-item');
    const emptyState = page.locator('.empty-state');
    const hasNotifs = await notifItems.first().isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    expect(hasNotifs || hasEmpty).toBeTruthy();
  });

  test('empty state shows correct message when no notifications', async ({ page }) => {
    await page.waitForTimeout(3000);
    const emptyState = page.locator('.empty-state');
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    if (!hasEmpty) {
      test.skip();
      return;
    }
    await expect(page.getByText('Aucune notification')).toBeVisible();
  });
});
