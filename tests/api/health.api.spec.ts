import { test, expect } from './api.fixtures';

test('GET /ping should confirm the API is available', async ({
  bookingClient,
}) => {
  const response = await bookingClient.ping();

  expect(
    response.ok(),
    'Health check should return a success response',
  ).toBeTruthy();
});