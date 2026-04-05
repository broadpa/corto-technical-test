import { test, expect } from './auth.fixtures';
import books from './data/books.json';

test.describe.configure({ mode: 'serial' });

test('A logged-in user should see a pre-associated book in the profile collection', async ({
  bookstoreApiClient,
  loginPage,
  profilePage,
  testUser,
}) => {
  // Use the API for setup so the UI test stays focused on profile behaviour rather
  // than account/book preparation.
  const addBookResponse = await bookstoreApiClient.addBook(
    testUser.userId,
    books.gitPocketGuide.isbn,
    testUser.token,
  );

  expect(
    addBookResponse.ok(),
    'API setup should associate the selected book with the user',
  ).toBeTruthy();

  try {
    await loginPage.goto();
    await loginPage.login(testUser.userName, testUser.password);

    await profilePage.expectLoadedForUser(testUser.userName);
    await profilePage.expectBookInCollection(books.gitPocketGuide.title);
  } finally {
    let cleanupToken: string | undefined;

    try {
      const cleanupTokenResponse = await bookstoreApiClient.generateToken({
        userName: testUser.userName,
        password: testUser.password,
      });

      if (cleanupTokenResponse.ok()) {
        const cleanupTokenBody = await cleanupTokenResponse.json();
        cleanupToken = cleanupTokenBody.token as string | undefined;
      }
    } catch {
      console.warn(
        'Best-effort cleanup: could not obtain a fresh token for book removal',
      );
    }

    if (cleanupToken) {
      const deleteBookResponse = await bookstoreApiClient.deleteBook(
        testUser.userId,
        books.gitPocketGuide.isbn,
        cleanupToken,
      );

      if (!deleteBookResponse.ok()) {
        console.warn(
          `Best-effort cleanup: delete book failed with status ${deleteBookResponse.status()}`,
        );
      }
    }
  }
});