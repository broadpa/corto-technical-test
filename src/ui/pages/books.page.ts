import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

type BookRowExpectation = {
  title: string;
  author?: string;
  publisher?: string;
};

export class BooksPage extends BasePage {
  private readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#searchBox');
  }

  async goto(): Promise<void> {
    await this.page.goto('/books');
    await this.removeFixedBanners();

    await expect(
      this.page,
      'Book Store page should open successfully',
    ).toHaveURL(/\/books$/);

    await expect(
      this.searchInput,
      'Book Store search input should be visible',
    ).toBeVisible();
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async openBook(title: string): Promise<void> {
    await Promise.all([
      this.page.waitForURL(
        (url: URL) => url.toString().includes('/books?search='),
        { timeout: 10_000 },
      ),
      this.bookLink(title).click(),
    ]);
  }

  async expectBookVisible(title: string): Promise<void> {
    await expect(
      this.bookLink(title),
      `Book "${title}" should be visible in the catalog`,
    ).toBeVisible();
  }

  async expectBookNotVisible(title: string): Promise<void> {
    await expect(
      this.bookLink(title),
      `Book "${title}" should not be visible in the current results`,
    ).toBeHidden();
  }

  async expectSelectedBookRow(book: BookRowExpectation): Promise<void> {
    const row = this.bookRow(book.title);

    await expect(
      row,
      `Row for "${book.title}" should be visible`,
    ).toBeVisible();

    if (book.author) {
      await expect(
        row,
        `Row for "${book.title}" should show the correct author`,
      ).toContainText(book.author);
    }

    if (book.publisher) {
      await expect(
        row,
        `Row for "${book.title}" should show the correct publisher`,
      ).toContainText(book.publisher);
    }
  }

  private bookLink(title: string): Locator {
    return this.page.getByRole('link', { name: title, exact: true });
  }

  private bookRow(title: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.bookLink(title),
    });
  }
}