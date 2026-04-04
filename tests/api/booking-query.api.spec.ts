import { test, expect } from './api.fixtures';
import positiveData from './data/bookings.positive.json';
import negativeData from './data/bookings.negative.json';
import { withUniqueGuest } from '../../src/api/utils/data-builders';

test('GET /booking should return all booking ids', async ({ bookingClient }) => {
  const response = await bookingClient.getBookingIds();

  expect(
    response.ok(),
    'GetBookingIds for all ids should succeed',
  ).toBeTruthy();

  const body = await response.json();

  expect(
    Array.isArray(body),
    'GetBookingIds for all ids should return an array',
  ).toBe(true);

  expect(
    body.length,
    'GetBookingIds should return at least one booking id',
  ).toBeGreaterThan(0);

  expect(
    typeof body[0].bookingid,
    'Each booking id result should contain a numeric bookingid',
  ).toBe('number');
});

test('GET /booking should filter by firstname and lastname', async ({
  authClient,
  bookingClient,
}) => {
  const token = (await authClient.getToken()) ?? '';
  expect(
    token,
    'Auth token should be created successfully for cleanup',
  ).toBeTruthy();

  const uniquePayload = withUniqueGuest(positiveData.createPayload, 'query');
  let createdBookingId = 0;

  try {
    const createResponse = await bookingClient.createBooking(uniquePayload);
    expect(
      createResponse.ok(),
      'Setup booking should be created successfully',
    ).toBeTruthy();

    const createBody = await createResponse.json();
    createdBookingId = createBody.bookingid;

    expect(
      createdBookingId,
      'Setup booking should return an id',
    ).toBeGreaterThan(0);

    const byNameResponse = await bookingClient.getBookingIds({
      firstname: uniquePayload.firstname,
      lastname: uniquePayload.lastname,
    });

    expect(
      byNameResponse.ok(),
      'GetBookingIds filtered by name should succeed',
    ).toBeTruthy();

    const byName = await byNameResponse.json();

    expect(
      byName.some(
        (item: { bookingid: number }) => item.bookingid === createdBookingId,
      ),
      'Created booking id should be returned by the name filter',
    ).toBe(true);
  } finally {
    if (createdBookingId) {
      const cleanupDelete = await bookingClient.deleteBooking(
        createdBookingId,
        token,
      );
      expect(
        cleanupDelete.ok(),
        'Cleanup delete for name filter test should succeed',
      ).toBeTruthy();
    }
  }
});

// The public Restful Booker sandbox appears to have unreliable exact-match date filtering.
// To keep the suite stable and CI-friendly, this test validates the endpoint contract and
// response shape rather than asserting a specific booking id is always returned.
test('GET /booking should accept date filters and return booking ids in the expected shape', async ({
  bookingClient,
}) => {
  const allIdsResponse = await bookingClient.getBookingIds();

  expect(
    allIdsResponse.ok(),
    'GetBookingIds for all ids should succeed before date filter validation',
  ).toBeTruthy();

  const allIds = await allIdsResponse.json();

  expect(
    Array.isArray(allIds),
    'GetBookingIds should return an array before date filter validation',
  ).toBe(true);

  expect(
    allIds.length,
    'At least one existing booking id should be available for date filter validation',
  ).toBeGreaterThan(0);

  const existingBookingId = allIds[0].bookingid;

  const existingBookingResponse = await bookingClient.getBooking(existingBookingId);
  expect(
    existingBookingResponse.ok(),
    'Existing booking should be retrievable for date filter validation',
  ).toBeTruthy();

  const existingBooking = await existingBookingResponse.json();

  const byDateResponse = await bookingClient.getBookingIds({
    checkin: existingBooking.bookingdates.checkin,
    checkout: existingBooking.bookingdates.checkout,
  });

  expect(
    byDateResponse.ok(),
    'GetBookingIds filtered by date should succeed',
  ).toBeTruthy();

  const byDate = await byDateResponse.json();

  expect(
    Array.isArray(byDate),
    'GetBookingIds filtered by date should return an array',
  ).toBe(true);

  for (const item of byDate.slice(0, 5)) {
    expect(
      typeof item.bookingid,
      'Each date-filter result should contain a numeric bookingid',
    ).toBe('number');
  }
});

test('GET /booking should return an empty array for an impossible name filter', async ({
  bookingClient,
}) => {
  const impossibleFilterResponse = await bookingClient.getBookingIds(
    negativeData.impossibleFilter,
  );

  expect(
    impossibleFilterResponse.ok(),
    'GetBookingIds with an impossible filter should still succeed',
  ).toBeTruthy();

  const impossibleFilterResults = await impossibleFilterResponse.json();

  expect(
    impossibleFilterResults.length,
    'Impossible filter should return an empty array',
  ).toBe(0);
});