import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  private readonly userNameValue: Locator;
  private readonly logoutButton: Locator;
  private readonly loadingLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page
      .locator('button')
      .filter({ hasText: /log\s*out/i })
      .first();
    this.loadingLabel = page.locator('#loading-label');
  }

  async expectLoadedForUser(userName: string): Promise<void> {
    await this.removeFixedBanners();

    await expect(
      this.page,
      'Successful login should navigate to the profile page',
    ).toHaveURL(/\/profile$/);

    await this.loadingLabel
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => {
        // The loading label is not always present. Continue if it never appears.
      });

    await expect(
      this.userNameValue,
      'Logged-in username should be visible on the profile page',
    ).toHaveText(userName);

    await this.logoutButton.scrollIntoViewIfNeeded();

    await expect(
      this.logoutButton,
      'Logout button should be visible for a logged-in user',
    ).toBeVisible();
  }

  async expectBookInCollection(title: string): Promise<void> {
    await this.loadingLabel
      .waitFor({ state: 'hidden', timeout: 10_000 })
      .catch(() => {
        // The loading label is not always present. Continue if it never appears.
      });

    await expect(
      this.page.getByRole('link', { name: title, exact: true }),
      `Book "${title}" should be visible in the user collection`,
    ).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.logoutButton.scrollIntoViewIfNeeded();

    await Promise.all([
      this.page.waitForURL(/\/login$/, { timeout: 10_000 }),
      this.logoutButton.click(),
    ]);
  }
}