import { test, expect } from './api.fixtures';

test('POST /auth should return a token for valid credentials', async ({
  authClient,
}) => {
  const response = await authClient.createToken();

  expect(response.ok(), 'CreateToken should return success').toBeTruthy();

  const body = await response.json();

  expect(body.token, 'CreateToken should return a token').toBeTruthy();
});