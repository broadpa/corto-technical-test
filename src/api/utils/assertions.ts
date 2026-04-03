import { expect } from '@playwright/test';
import { BookingPayload } from '../types/booking';

export function expectBookingToMatch(
  actual: BookingPayload,
  expected: Partial<BookingPayload>,
): void {
  if (expected.firstname !== undefined) {
    expect(actual.firstname, 'firstname should match expected value').toBe(
      expected.firstname,
    );
  }

  if (expected.lastname !== undefined) {
    expect(actual.lastname, 'lastname should match expected value').toBe(
      expected.lastname,
    );
  }

  if (expected.totalprice !== undefined) {
    expect(actual.totalprice, 'totalprice should match expected value').toBe(
      expected.totalprice,
    );
  }

  if (expected.depositpaid !== undefined) {
    expect(actual.depositpaid, 'depositpaid should match expected value').toBe(
      expected.depositpaid,
    );
  }

  if (expected.bookingdates?.checkin !== undefined) {
    expect(
      actual.bookingdates.checkin,
      'checkin date should match expected value',
    ).toBe(expected.bookingdates.checkin);
  }

  if (expected.bookingdates?.checkout !== undefined) {
    expect(
      actual.bookingdates.checkout,
      'checkout date should match expected value',
    ).toBe(expected.bookingdates.checkout);
  }

  if (expected.additionalneeds !== undefined) {
    expect(
      actual.additionalneeds,
      'additionalneeds should match expected value',
    ).toBe(expected.additionalneeds);
  }
}