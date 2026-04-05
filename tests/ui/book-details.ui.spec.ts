import { test, expect } from './ui.fixtures';
import books from './data/books.json';

test('Selecting a book title should update the route and keep the correct row visible', async ({
  booksPage,
  page,
}) => {
  await booksPage.goto();
  await booksPage.openBook(books.gitPocketGuide.title);

  await expect(
    page,
    'Selecting a book should update the URL with the selected ISBN search parameter',
  ).toHaveURL(/\/books\?search=/);

  await booksPage.expectSelectedBookRow(books.gitPocketGuide);
});