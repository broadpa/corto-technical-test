import { test as base } from '@playwright/test';
import { BooksPage } from '../../src/ui/pages/books.page';

type UiFixtures = {
  booksPage: BooksPage;
};

export const test = base.extend<UiFixtures>({
  booksPage: async ({ page }, use) => {
    await use(new BooksPage(page));
  },
});

export { expect } from '@playwright/test';