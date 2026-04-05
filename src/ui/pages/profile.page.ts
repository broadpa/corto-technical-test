import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  private readonly userNameValue: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: /log\s*out/i });
  }

  async expectLoadedForUser(userName: string): Promise<void> {
    await this.removeFixedBanners();

    await expect(
      this.page,
      'Successful login should navigate to the profile page',
    ).toHaveURL(/\/profile$/);

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