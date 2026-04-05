import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async removeFixedBanners(): Promise<void> {
    await this.page
      .evaluate(() => {
        document.querySelector('#fixedban')?.remove();
        document.querySelector('footer')?.remove();
      })
      .catch(() => {
        // Best-effort cleanup only. Tests should continue even if these elements are missing.
      });
  }
}