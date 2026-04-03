import { test as base, APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../../src/config/env';
import { AuthClient } from '../../src/api/clients/auth.client';
import { BookingClient } from '../../src/api/clients/booking.client';

type ApiFixtures = {
  apiContext: APIRequestContext;
  authClient: AuthClient;
  bookingClient: BookingClient;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });

    await use(context);
    await context.dispose();
  },

  authClient: async ({ apiContext }, use) => {
    await use(new AuthClient(apiContext));
  },

  bookingClient: async ({ apiContext }, use) => {
    await use(new BookingClient(apiContext));
  },
});

export { expect } from '@playwright/test';