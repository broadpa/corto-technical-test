import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly userNameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.userNameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
    await this.removeFixedBanners();

    await expect(
      this.page,
      'Login page should open successfully',
    ).toHaveURL(/\/login$/);

    await expect(
      this.userNameInput,
      'Username input should be visible on the login page',
    ).toBeVisible();

    await expect(
      this.passwordInput,
      'Password input should be visible on the login page',
    ).toBeVisible();
  }

  async login(userName: string, password: string): Promise<void> {
    await this.userNameInput.fill(userName);
    await this.passwordInput.fill(password);

    await Promise.all([
      this.page.waitForURL(/\/profile$/, { timeout: 10_000 }),
      this.loginButton.click(),
    ]);
  }

  async expectLoginFormVisible(): Promise<void> {
    await expect(
      this.userNameInput,
      'Username input should be visible',
    ).toBeVisible();

    await expect(
      this.passwordInput,
      'Password input should be visible',
    ).toBeVisible();

    await expect(
      this.loginButton,
      'Login button should be visible',
    ).toBeVisible();
  }
}