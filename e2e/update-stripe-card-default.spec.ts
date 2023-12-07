import { test, expect } from '@playwright/test';
import translations from '../client/i18n/locales/english/translations.json';

test.describe('Update Card Page for Non-Donor Authenticated User', () => {
  test.use({ storageState: 'playwright/.auth/certified-user.json' });
  test('should render correctly', async ({ page }) => {
    await expect(page).toHaveTitle(
      `${translations.misc['update-your-card']} | freeCodeCamp.org`
    );
    const h1 = page.locator('h1');
    await expect(h1).toHaveText(
      `${translations.learn['donation-record-not-found']}`
    );
  });
});

// Unauthrorized, and donor user states should be added here in upcoming PRs
