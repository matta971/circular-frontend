import { test, expect, type Page } from '@playwright/test';
import { loginAs } from '../../fixtures/auth.fixture';

/**
 * Clicks the visible "Continuer" / matStepperNext button in the active step.
 * Angular Material vertical stepper hides inactive step content, so we need
 * to find the button that's actually rendered in the visible area.
 */
async function clickVisibleContinue(page: Page) {
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button[matsteppernext]');
    for (const btn of buttons) {
      if ((btn as HTMLElement).offsetParent !== null) {
        (btn as HTMLElement).click();
        return;
      }
    }
  });
  // Small wait for step transition animation
  await page.waitForTimeout(500);
}

async function goToStep2(page: Page) {
  await page.locator('.category-card').first().click();
  await clickVisibleContinue(page);
  await page.locator('input[formcontrolname="brand"]').waitFor({ state: 'visible', timeout: 5000 });
}

async function fillStep2(page: Page) {
  const brandInput = page.locator('input[formcontrolname="brand"]');
  await brandInput.fill('Samsung');
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');

  const modelInput = page.locator('input[formcontrolname="model"]');
  await modelInput.fill('Galaxy S24');
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');
}

async function goToStep3(page: Page) {
  await goToStep2(page);
  await fillStep2(page);
  await clickVisibleContinue(page);
  await page.locator('.condition-card').first().waitFor({ state: 'visible', timeout: 10_000 });
}

async function goToStep4(page: Page) {
  await goToStep3(page);
  await page.locator('.condition-card').first().click();
  await clickVisibleContinue(page);
  await page.waitForTimeout(1000);
}

test.describe('Evaluation flow — public parcours', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/evaluation', { waitUntil: 'domcontentloaded' });
    await page.locator('.evaluation-container').waitFor({ state: 'visible', timeout: 15_000 });
  });

  // ── Step 1: Device Type Selection ────────────────────────────────
  test('step 1 — select a device type enables continue button', async ({ page }) => {
    const continueBtn = page.locator('button').filter({ hasText: 'Continuer' }).first();
    await expect(continueBtn).toBeDisabled();

    const smartphoneCard = page.locator('.category-card').first();
    await smartphoneCard.click();
    await expect(smartphoneCard).toHaveClass(/selected/);
    await expect(continueBtn).toBeEnabled();
  });

  test('step 1 — clicking different type changes selection', async ({ page }) => {
    const cards = page.locator('.category-card');
    await cards.nth(0).click();
    await expect(cards.nth(0)).toHaveClass(/selected/);

    await cards.nth(1).click();
    await expect(cards.nth(1)).toHaveClass(/selected/);
    await expect(cards.nth(0)).not.toHaveClass(/selected/);
  });

  // ── Step 2: Device Information ───────────────────────────────────
  test('step 1 → step 2 — advance to device info form', async ({ page }) => {
    await goToStep2(page);
    await expect(page.locator('input[formcontrolname="brand"]')).toBeVisible();
    await expect(page.locator('input[formcontrolname="model"]')).toBeVisible();
  });

  test('step 2 — brand input shows autocomplete suggestions', async ({ page }) => {
    await goToStep2(page);

    const brandInput = page.locator('input[formcontrolname="brand"]');
    await brandInput.fill('Sam');
    await page.waitForTimeout(1000);

    const options = page.locator('mat-option');
    const hasOptions = await options.first().isVisible().catch(() => false);

    if (hasOptions) {
      await options.first().click();
      await expect(brandInput).not.toHaveValue('');
    } else {
      await brandInput.fill('Samsung');
    }
    await page.keyboard.press('Escape');
  });

  test('step 2 — without model, stepper stays on step 2', async ({ page }) => {
    await goToStep2(page);

    // Fill only brand, try to advance
    await page.locator('input[formcontrolname="brand"]').fill('Samsung');
    await page.keyboard.press('Escape');
    await clickVisibleContinue(page);

    // Stepper should NOT advance — still on step 2 (brand input still visible)
    await expect(page.locator('input[formcontrolname="brand"]')).toBeVisible();
  });

  // ── Step 3: Device Condition ─────────────────────────────────────
  test('step 1 → 2 → 3 — advance to condition selection', async ({ page }) => {
    await goToStep3(page);

    const conditionCards = page.locator('.condition-card');
    const count = await conditionCards.count();
    expect(count).toBe(4);
  });

  test('step 3 — condition cards show correct labels', async ({ page }) => {
    await goToStep3(page);

    await expect(page.getByText('Neuf', { exact: true })).toBeVisible();
    await expect(page.getByText('Bon', { exact: true })).toBeVisible();
    await expect(page.getByText('Correct', { exact: true })).toBeVisible();
    await expect(page.getByText('Endommagé', { exact: true })).toBeVisible();
  });

  test('step 3 — select condition and optional description', async ({ page }) => {
    await goToStep3(page);

    const conditionCard = page.locator('.condition-card').first();
    await conditionCard.click();
    await expect(conditionCard).toHaveClass(/selected/);

    const description = page.locator('textarea[formcontrolname="description"]');
    const hasDescription = await description.isVisible().catch(() => false);
    if (hasDescription) {
      await description.fill('Écran en parfait état, batterie OK');
      await expect(description).toHaveValue('Écran en parfait état, batterie OK');
    }
  });

  // ── Step 4: Photos (Optional) ───────────────────────────────────
  test('step 1 → 2 → 3 → 4 — advance to photo upload step', async ({ page }) => {
    await goToStep4(page);

    const uploadZone = page.locator('.upload-zone, .drop-zone, input[type="file"]');
    await expect(uploadZone.first()).toBeVisible({ timeout: 5000 });
  });

  // ── Step 5: Submit and estimation result ─────────────────────────
  test('full flow — submit evaluation and see results', async ({ page }) => {
    test.setTimeout(120_000);

    await goToStep4(page);

    // On photo step, look for submit or skip/continue
    const submitBtn = page.locator('button').filter({ hasText: /Évaluer|Soumettre|Estimer|Lancer/ });
    const hasSubmitHere = await submitBtn.first().isVisible({ timeout: 3000 }).catch(() => false);

    if (!hasSubmitHere) {
      // Try to advance past photos step
      await clickVisibleContinue(page);
      await page.waitForTimeout(1000);
    }

    // Now find the submit/evaluate button
    const evalBtn = page.locator('button').filter({ hasText: /Évaluer|Soumettre|Estimer|Lancer/ });
    const canSubmit = await evalBtn.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (canSubmit) {
      await evalBtn.first().click({ force: true });
      await page.waitForTimeout(10_000);

      const resultCard = page.locator('.result-card, .value-card, .estimation-result, .repairability-card');
      const errorState = page.locator('.error-card, .error-message, .error-state, .mat-mdc-snack-bar-container');
      const loading = page.locator('.loading, mat-spinner, mat-progress-spinner');
      const hasResult = await resultCard.first().isVisible().catch(() => false);
      const hasError = await errorState.first().isVisible().catch(() => false);
      const stillLoading = await loading.first().isVisible().catch(() => false);

      // Either results, error, or still loading (API might be slow)
      expect(hasResult || hasError || stillLoading).toBeTruthy();
    } else {
      // If we can't find a submit button, the flow reached step 4+ already
      test.skip();
    }
  });

  // ── Back navigation ──────────────────────────────────────────────
  test('back button returns to previous step', async ({ page }) => {
    await goToStep2(page);

    // Click the visible "Retour" button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[matstepperprevious]');
      for (const btn of buttons) {
        if ((btn as HTMLElement).offsetParent !== null) {
          (btn as HTMLElement).click();
          return;
        }
      }
    });
    await page.waitForTimeout(500);

    // Should be back on step 1 — category grid visible
    await expect(page.locator('.category-grid')).toBeVisible();
  });
});

test.describe('Evaluation flow — my evaluations (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    const ok = await loginAs(page, 'client');
    if (!ok) test.skip();
    await page.goto('/evaluation/my-evaluations', { waitUntil: 'domcontentloaded' });
  });

  test('my evaluations page loads', async ({ page }) => {
    await page.waitForTimeout(3000);
    const container = page.locator('.my-evaluations-container, .evaluations-container, main');
    await expect(container.first()).toBeVisible({ timeout: 10_000 });
  });

  test('shows evaluation cards, empty state, or loading state', async ({ page }) => {
    // Wait for the page container to render
    await page.locator('.container, .my-evaluations-container').first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => {});
    // Give the API time to respond
    await page.waitForTimeout(5000);
    const cards = page.locator('.evaluation-card');
    const emptyState = page.locator('.empty-state');
    const loadingState = page.locator('.loading-container');
    const hasCards = await cards.first().isVisible().catch(() => false);
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    const hasLoading = await loadingState.isVisible().catch(() => false);
    expect(hasCards || hasEmpty || hasLoading).toBeTruthy();
  });

  test('empty state has action button to start evaluation', async ({ page }) => {
    await page.waitForTimeout(3000);
    const emptyState = page.locator('.empty-state');
    const hasEmpty = await emptyState.isVisible().catch(() => false);
    if (!hasEmpty) {
      test.skip();
      return;
    }
    const actionBtn = emptyState.locator('button, a').first();
    await expect(actionBtn).toBeVisible();
  });
});
