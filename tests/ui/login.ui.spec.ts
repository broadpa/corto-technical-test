import { test } from './auth.fixtures';

test('A valid Book Store user should be able to log in and reach the profile page', async ({
  loginPage,
  profilePage,
  testUser,
}) => {
  await loginPage.goto();
  await loginPage.login(testUser.userName, testUser.password);

  await profilePage.expectLoadedForUser(testUser.userName);
});

test('A logged-in Book Store user should be able to log out', async ({
  loginPage,
  profilePage,
  testUser,
}) => {
  await loginPage.goto();
  await loginPage.login(testUser.userName, testUser.password);

  await profilePage.expectLoadedForUser(testUser.userName);
  await profilePage.logout();
  await loginPage.expectLoginFormVisible();
});