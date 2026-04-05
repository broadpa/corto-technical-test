import { test } from './ui.fixtures';
import books from './data/books.json';

test('Book Store search should narrow the catalog to a matching title', async ({
  booksPage,
}) => {
  await booksPage.goto();
  await booksPage.searchFor(books.gitPocketGuide.title);

  await booksPage.expectBookVisible(books.gitPocketGuide.title);
  await booksPage.expectBookNotVisible(books.designPatterns.title);
});

test('Book Store search should hide known books when the term has no matches', async ({
  booksPage,
}) => {
  await booksPage.goto();
  await booksPage.searchFor(books.noMatchTerm);

  await booksPage.expectBookNotVisible(books.gitPocketGuide.title);
  await booksPage.expectBookNotVisible(books.designPatterns.title);
});