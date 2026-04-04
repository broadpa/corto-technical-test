# Raw AI Output

```ts
import { test, expect } from '@playwright/test';

test('PATCH /booking/:id updates a booking', async ({ playwright }) => {
  const request = await playwright.request.newContext({
    baseURL: 'https://restful-booker.herokuapp.com'
  });

  const authResponse = await request.post('/auth', {
    data: {
      username: 'admin',
      password: 'password123'
    }
  });

  const authBody = await authResponse.json();
  const token = authBody.token;

  const createResponse = await request.post('/booking', {
    data: {
      firstname: 'John',
      lastname: 'Smith',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-01-01',
        checkout: '2025-01-05'
      },
      additionalneeds: 'Breakfast'
    }
  });

  const createBody = await createResponse.json();
  const bookingId = createBody.bookingid;

  const patchResponse = await request.patch(`/booking/${bookingId}`, {
    headers: {
      Cookie: `token=${token}`
    },
    data: {
      firstname: 'UpdatedName',
      additionalneeds: 'Dinner'
    }
  });

  expect(patchResponse.ok()).toBeTruthy();

  const getResponse = await request.get(`/booking/${bookingId}`);
  const getBody = await getResponse.json();

  expect(getBody.firstname).toBe('UpdatedName');
  expect(getBody.additionalneeds).toBe('Dinner');

  const deleteResponse = await request.delete(`/booking/${bookingId}`, {
    headers: {
      Cookie: `token=${token}`
    }
  });

  expect(deleteResponse.ok()).toBeTruthy();
});