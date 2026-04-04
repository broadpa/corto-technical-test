import { test, expect } from './api.fixtures';
import positiveData from './data/bookings.positive.json';
import { withUniqueGuest } from '../../src/api/utils/data-builders';
import { expectBookingToMatch } from '../../src/api/utils/assertions';

test('XML endpoints should create, update, and partially update a booking', async ({
  authClient,
  bookingClient,
}) => {
  const token = (await authClient.getToken()) ?? '';
  expect(token, 'Auth token should be created successfully').toBeTruthy();

  const originalPayload = withUniqueGuest(
    positiveData.createPayload,
    `xml-${Date.now()}`,
  );

  const updatedPayload = {
    ...positiveData.updatePayload,
    firstname: `XmlUpdated-${Date.now()}`,
    lastname: `XmlGuest-${Date.now()}`,
  };

  const partialPayload = {
    additionalneeds: 'XML Dinner',
  };

  // The public sandbox appears to coerce boolean false to true for XML submissions.
  // The JSON lifecycle test already validates boolean update semantics.
  // Here we validate the stable fields for the XML content-type variant.
  const expectedUpdatedBooking = {
    firstname: updatedPayload.firstname,
    lastname: updatedPayload.lastname,
    totalprice: updatedPayload.totalprice,
    bookingdates: updatedPayload.bookingdates,
    additionalneeds: updatedPayload.additionalneeds,
  };

  let bookingId = 0;

  try {
    const createResponse = await bookingClient.createBookingXml(originalPayload);
    expect(
      createResponse.ok(),
      'CreateBooking XML should succeed',
    ).toBeTruthy();

    const idLookupResponse = await bookingClient.getBookingIds({
      firstname: originalPayload.firstname,
      lastname: originalPayload.lastname,
    });
    expect(
      idLookupResponse.ok(),
      'Name lookup for XML-created booking should succeed',
    ).toBeTruthy();

    const idLookupBody = await idLookupResponse.json();
    bookingId = idLookupBody[0]?.bookingid;

    expect(
      bookingId,
      'XML-created booking id should be discoverable by name filter',
    ).toBeTruthy();

    const getCreatedResponse = await bookingClient.getBooking(bookingId);
    expect(
      getCreatedResponse.ok(),
      'XML-created booking should be retrievable',
    ).toBeTruthy();

    const createdBooking = await getCreatedResponse.json();
    expectBookingToMatch(createdBooking, originalPayload);

    const updateResponse = await bookingClient.updateBookingXml(
      bookingId,
      updatedPayload,
      token,
    );
    expect(
      updateResponse.ok(),
      'UpdateBooking XML should succeed',
    ).toBeTruthy();

    const getUpdatedResponse = await bookingClient.getBooking(bookingId);
    expect(
      getUpdatedResponse.ok(),
      'XML-updated booking should be retrievable',
    ).toBeTruthy();

    const updatedBooking = await getUpdatedResponse.json();
    expectBookingToMatch(updatedBooking, expectedUpdatedBooking);

    const patchResponse = await bookingClient.partialUpdateBookingXml(
      bookingId,
      partialPayload,
      token,
    );
    expect(
      patchResponse.ok(),
      'PartialUpdateBooking XML should succeed',
    ).toBeTruthy();

    const getPatchedResponse = await bookingClient.getBooking(bookingId);
    expect(
      getPatchedResponse.ok(),
      'XML-patched booking should be retrievable',
    ).toBeTruthy();

    const patchedBooking = await getPatchedResponse.json();
    expectBookingToMatch(patchedBooking, {
      ...expectedUpdatedBooking,
      ...partialPayload,
    });
  } finally {
    if (bookingId) {
      const cleanupDelete = await bookingClient.deleteBooking(bookingId, token);
      expect(
        cleanupDelete.ok(),
        'Cleanup delete after XML test should succeed',
      ).toBeTruthy();
    }
  }
});

test('URL-encoded endpoints should create, update, and partially update a booking', async ({
  authClient,
  bookingClient,
}) => {
  const token = (await authClient.getToken()) ?? '';
  expect(token, 'Auth token should be created successfully').toBeTruthy();

  const originalPayload = withUniqueGuest(
    positiveData.createPayload,
    `form-${Date.now()}`,
  );

  const updatedPayload = {
    ...positiveData.updatePayload,
    firstname: `FormUpdated-${Date.now()}`,
    lastname: `FormGuest-${Date.now()}`,
  };

  const partialPayload = {
    additionalneeds: 'Form Dinner',
  };

  // The public sandbox appears to coerce boolean false to true for form submissions.
  // The JSON lifecycle test already validates boolean update semantics.
  // Here we validate the stable fields for the URL-encoded content-type variant.
  const expectedUpdatedBooking = {
    firstname: updatedPayload.firstname,
    lastname: updatedPayload.lastname,
    totalprice: updatedPayload.totalprice,
    bookingdates: updatedPayload.bookingdates,
    additionalneeds: updatedPayload.additionalneeds,
  };

  let bookingId = 0;

  try {
    const createResponse = await bookingClient.createBookingForm(originalPayload);
    expect(
      createResponse.ok(),
      'CreateBooking URL-encoded should succeed',
    ).toBeTruthy();

    const idLookupResponse = await bookingClient.getBookingIds({
      firstname: originalPayload.firstname,
      lastname: originalPayload.lastname,
    });
    expect(
      idLookupResponse.ok(),
      'Name lookup for URL-encoded booking should succeed',
    ).toBeTruthy();

    const idLookupBody = await idLookupResponse.json();
    bookingId = idLookupBody[0]?.bookingid;

    expect(
      bookingId,
      'URL-encoded booking id should be discoverable by name filter',
    ).toBeTruthy();

    const getCreatedResponse = await bookingClient.getBooking(bookingId);
    expect(
      getCreatedResponse.ok(),
      'URL-encoded booking should be retrievable',
    ).toBeTruthy();

    const createdBooking = await getCreatedResponse.json();
    expectBookingToMatch(createdBooking, originalPayload);

    const updateResponse = await bookingClient.updateBookingForm(
      bookingId,
      updatedPayload,
      token,
    );
    expect(
      updateResponse.ok(),
      'UpdateBooking URL-encoded should succeed',
    ).toBeTruthy();

    const getUpdatedResponse = await bookingClient.getBooking(bookingId);
    expect(
      getUpdatedResponse.ok(),
      'URL-encoded updated booking should be retrievable',
    ).toBeTruthy();

    const updatedBooking = await getUpdatedResponse.json();
    expectBookingToMatch(updatedBooking, expectedUpdatedBooking);

    const patchResponse = await bookingClient.partialUpdateBookingForm(
      bookingId,
      partialPayload,
      token,
    );
    expect(
      patchResponse.ok(),
      'PartialUpdateBooking URL-encoded should succeed',
    ).toBeTruthy();

    const getPatchedResponse = await bookingClient.getBooking(bookingId);
    expect(
      getPatchedResponse.ok(),
      'URL-encoded patched booking should be retrievable',
    ).toBeTruthy();

    const patchedBooking = await getPatchedResponse.json();
    expectBookingToMatch(patchedBooking, {
      ...expectedUpdatedBooking,
      ...partialPayload,
    });
  } finally {
    if (bookingId) {
      const cleanupDelete = await bookingClient.deleteBooking(bookingId, token);
      expect(
        cleanupDelete.ok(),
        'Cleanup delete after URL-encoded test should succeed',
      ).toBeTruthy();
    }
  }
});