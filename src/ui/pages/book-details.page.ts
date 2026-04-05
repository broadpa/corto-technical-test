import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class BookDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectSelectionRoute(): Promise<void> {
    await this.removeFixedBanners();

    await expect(
      this.page,
      'Selecting a book should update the URL with the selected search parameter',
    ).toHaveURL(/\/books\?search=/);
  }
}