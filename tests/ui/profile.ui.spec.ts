import { test, expect } from './auth.fixtures';
import books from './data/books.json';

test('A logged-in user should see a pre-associated book in the profile collection', async ({
  bookstoreApiClient,
  loginPage,
  profilePage,
  testUser,
}) => {
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
    const cleanupTokenResponse = await bookstoreApiClient.generateToken({
      userName: testUser.userName,
      password: testUser.password,
    });

    if (!cleanupTokenResponse.ok()) {
      console.warn(
        `Best-effort cleanup: token generation for book removal failed with status ${cleanupTokenResponse.status()}`,
      );
      return;
    }

    const cleanupTokenBody = await cleanupTokenResponse.json();
    const cleanupToken = cleanupTokenBody.token as string | undefined;

    if (!cleanupToken) {
      console.warn(
        'Best-effort cleanup: token generation for book removal returned no token',
      );
      return;
    }

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
});