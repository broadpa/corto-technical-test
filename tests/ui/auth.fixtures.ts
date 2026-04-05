import { test as base, APIRequestContext, expect } from '@playwright/test';
import { UI_BASE_URL } from '../../src/config/env';
import { BooksPage } from '../../src/ui/pages/books.page';
import { LoginPage } from '../../src/ui/pages/login.page';
import { ProfilePage } from '../../src/ui/pages/profile.page';
import { BookStoreApiClient } from '../../src/ui/api/bookstore-api.client';
import {
  buildUniqueBookStoreUser,
  BookStoreUserCredentials,
} from '../../src/ui/utils/user-builder';

type TestUser = BookStoreUserCredentials & {
  userId: string;
  token: string;
};

type AuthUiFixtures = {
  bookstoreApiContext: APIRequestContext;
  bookstoreApiClient: BookStoreApiClient;
  booksPage: BooksPage;
  loginPage: LoginPage;
  profilePage: ProfilePage;
  testUser: TestUser;
};

async function getFreshToken(
  bookstoreApiClient: BookStoreApiClient,
  credentials: BookStoreUserCredentials,
): Promise<string | undefined> {
  const tokenResponse = await bookstoreApiClient.generateToken(credentials);

  if (!tokenResponse.ok()) {
    console.warn(
      `Best-effort cleanup: token generation failed with status ${tokenResponse.status()}`,
    );
    return undefined;
  }

  const tokenBody = await tokenResponse.json();
  return tokenBody.token as string | undefined;
}

export const test = base.extend<AuthUiFixtures>({
  bookstoreApiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: UI_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });

    await use(context);
    await context.dispose();
  },

  bookstoreApiClient: async ({ bookstoreApiContext }, use) => {
    await use(new BookStoreApiClient(bookstoreApiContext));
  },

  booksPage: async ({ page }, use) => {
    await use(new BooksPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },

  testUser: async ({ bookstoreApiClient }, use) => {
    const credentials = buildUniqueBookStoreUser();

    const createUserResponse = await bookstoreApiClient.createUser(credentials);
    expect(
      createUserResponse.ok(),
      'API setup should create a unique Book Store user successfully',
    ).toBeTruthy();

    const createUserBody = await createUserResponse.json();
    const userId = (createUserBody.userID ?? createUserBody.userId) as
      | string
      | undefined;

    expect(
      userId,
      'Created Book Store user should return a userID',
    ).toBeTruthy();

    const tokenResponse = await bookstoreApiClient.generateToken(credentials);
    expect(
      tokenResponse.ok(),
      'API setup should generate a token for the created user successfully',
    ).toBeTruthy();

    const tokenBody = await tokenResponse.json();
    const token = tokenBody.token as string | undefined;

    expect(
      token,
      'API setup should return a token for the created user',
    ).toBeTruthy();

    await use({
      ...credentials,
      userId: userId!,
      token: token!,
    });

    // Public sandbox cleanup is best-effort. Unique users keep runs isolated even if
    // deletion occasionally fails in the demo environment.
    const cleanupToken = await getFreshToken(bookstoreApiClient, credentials);

    if (cleanupToken && userId) {
      const deleteUserResponse = await bookstoreApiClient.deleteUser(
        userId,
        cleanupToken,
      );

      if (!deleteUserResponse.ok()) {
        console.warn(
          `Best-effort cleanup: delete user failed with status ${deleteUserResponse.status()}`,
        );
      }
    }
  },
});

export { expect } from '@playwright/test';