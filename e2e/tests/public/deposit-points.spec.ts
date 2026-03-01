import { test, expect } from '@playwright/test';

test.describe('Deposit points page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/deposit', { waitUntil: 'domcontentloaded' });
    await page.locator('.deposit-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  test('renders page with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Points de dépôt');
    await expect(page.getByText('Trouvez un point de dépôt')).toBeVisible();
  });

  test('search section has input and button', async ({ page }) => {
    const searchSection = page.locator('.search-section');
    await expect(searchSection).toBeVisible();
    await expect(searchSection.locator('input')).toBeVisible();
    await expect(searchSection.locator('button').filter({ hasText: 'Rechercher' })).toBeVisible();
  });

  test('filter chips are present with expected options', async ({ page }) => {
    const filterChips = page.locator('.filter-chips');
    await expect(filterChips).toBeVisible();
    await expect(filterChips.getByText('Tous')).toBeVisible();
    await expect(filterChips.getByText('Magasins')).toBeVisible();
    await expect(filterChips.getByText('Partenaires')).toBeVisible();
    await expect(filterChips.getByText('Déchetteries')).toBeVisible();
  });

  test('shows point cards or empty state', async ({ page }) => {
    await page.waitForTimeout(3000);
    const pointCards = page.locator('.point-card');
    const emptyState = page.locator('.empty-state');
    const hasCards = await pointCards.first().isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    expect(hasCards || hasEmpty).toBeTruthy();
  });

  test('if points exist — cards have address and action buttons', async ({ page }) => {
    await page.waitForTimeout(3000);
    const card = page.locator('.point-card').first();
    const hasCard = await card.isVisible().catch(() => false);
    if (!hasCard) {
      test.skip();
      return;
    }
    await expect(card.locator('.info-item').first()).toBeVisible();
    await expect(card.locator('button').filter({ hasText: 'Itinéraire' })).toBeVisible();
  });
});
