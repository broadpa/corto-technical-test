import { test, expect } from './api.fixtures';
import positiveData from './data/bookings.positive.json';
import { withUniqueGuest } from '../../src/api/utils/data-builders';
import { expectBookingToMatch } from '../../src/api/utils/assertions';

test('JSON lifecycle should create, retrieve, update, partially update, and delete a booking', async ({
  authClient,
  bookingClient,
}) => {
  const originalPayload = withUniqueGuest(positiveData.createPayload);
  const updatePayload = positiveData.updatePayload;
  const partialPayload = positiveData.partialPayload;

  let token = '';
  let bookingId = 0;

  await test.step('Create auth token', async () => {
    token = (await authClient.getToken()) ?? '';
    expect(token, 'Auth token should be created successfully').toBeTruthy();
  });

  await test.step('Create booking', async () => {
    const createResponse = await bookingClient.createBooking(originalPayload);

    expect(createResponse.ok(), 'CreateBooking should succeed').toBeTruthy();

    const createBody = await createResponse.json();
    bookingId = createBody.bookingid;

    expect(bookingId, 'Booking id should be returned').toBeGreaterThan(0);
    expectBookingToMatch(createBody.booking, originalPayload);
  });

  await test.step('Get booking by id', async () => {
    const getResponse = await bookingClient.getBooking(bookingId);

    expect(getResponse.ok(), 'GetBooking should succeed').toBeTruthy();

    const getBody = await getResponse.json();
    expectBookingToMatch(getBody, originalPayload);
  });

  await test.step('Update booking', async () => {
    const updateResponse = await bookingClient.updateBooking(
      bookingId,
      updatePayload,
      token,
    );

    expect(updateResponse.ok(), 'UpdateBooking should succeed').toBeTruthy();

    const verifyResponse = await bookingClient.getBooking(bookingId);
    expect(
      verifyResponse.ok(),
      'Updated booking should be retrievable',
    ).toBeTruthy();

    const verifyBody = await verifyResponse.json();
    expectBookingToMatch(verifyBody, updatePayload);
  });

  await test.step('Partial update booking', async () => {
    const patchResponse = await bookingClient.partialUpdateBooking(
      bookingId,
      partialPayload,
      token,
    );

    expect(
      patchResponse.ok(),
      'PartialUpdateBooking should succeed',
    ).toBeTruthy();

    const verifyResponse = await bookingClient.getBooking(bookingId);
    expect(
      verifyResponse.ok(),
      'Patched booking should be retrievable',
    ).toBeTruthy();

    const verifyBody = await verifyResponse.json();
    expectBookingToMatch(verifyBody, {
      ...updatePayload,
      ...partialPayload,
    });
  });

  await test.step('Delete booking', async () => {
    const deleteResponse = await bookingClient.deleteBooking(bookingId, token);

    expect(deleteResponse.ok(), 'DeleteBooking should succeed').toBeTruthy();

    const getDeletedResponse = await bookingClient.getBooking(bookingId);
    expect(
      getDeletedResponse.status(),
      'Deleted booking should return 404 when retrieved',
    ).toBe(404);
  });
});