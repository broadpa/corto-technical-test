import { test, expect } from './api.fixtures';
import positiveData from './data/bookings.positive.json';
import negativeData from './data/bookings.negative.json';
import { withUniqueGuest } from '../../src/api/utils/data-builders';

test('GET /booking/:id should return 404 for an unknown booking id', async ({
  bookingClient,
}) => {
  const response = await bookingClient.getBooking(negativeData.unknownBookingId);

  expect(
    response.status(),
    'Unknown booking id should return 404',
  ).toBe(404);
});

test('PUT, PATCH and DELETE should not succeed without auth', async ({
  authClient,
  bookingClient,
}) => {
  const token = (await authClient.getToken()) ?? '';
  expect(
    token,
    'Auth token should be created successfully for cleanup',
  ).toBeTruthy();

  const payload = withUniqueGuest(positiveData.createPayload, 'noauth');
  let bookingId = 0;

  try {
    const createResponse = await bookingClient.createBooking(payload);
    expect(
      createResponse.ok(),
      'Setup booking should be created successfully',
    ).toBeTruthy();

    const createBody = await createResponse.json();
    bookingId = createBody.bookingid;

    expect(bookingId, 'Setup booking should return an id').toBeGreaterThan(0);

    const unauthorizedUpdate = await bookingClient.updateBookingJson(
      bookingId,
      positiveData.updatePayload,
    );
    expect(
      unauthorizedUpdate.ok(),
      'Update without auth should not succeed',
    ).toBe(false);

    const unauthorizedPatch = await bookingClient.partialUpdateBookingJson(
      bookingId,
      positiveData.partialPayload,
    );
    expect(
      unauthorizedPatch.ok(),
      'Partial update without auth should not succeed',
    ).toBe(false);

    const unauthorizedDelete = await bookingClient.deleteBooking(bookingId);
    expect(
      unauthorizedDelete.ok(),
      'Delete without auth should not succeed',
    ).toBe(false);

    const verifyResponse = await bookingClient.getBooking(bookingId);
    expect(
      verifyResponse.ok(),
      'Booking should still exist after failed unauthorized deletion',
    ).toBeTruthy();
  } finally {
    if (bookingId) {
      const cleanupDelete = await bookingClient.deleteBooking(bookingId, token);
      expect(
        cleanupDelete.ok(),
        'Cleanup delete for negative test should succeed',
      ).toBeTruthy();
    }
  }
});