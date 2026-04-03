import { XMLBuilder } from 'fast-xml-parser';
import { BookingPayload } from '../types/booking';

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
});

export function toBookingXml(payload: Partial<BookingPayload>): string {
  return xmlBuilder.build({ booking: payload });
}

export function toBookingForm(payload: Partial<BookingPayload>): string {
  const params = new URLSearchParams();

  if (payload.firstname !== undefined) {
    params.set('firstname', payload.firstname);
  }

  if (payload.lastname !== undefined) {
    params.set('lastname', payload.lastname);
  }

  if (payload.totalprice !== undefined) {
    params.set('totalprice', String(payload.totalprice));
  }

  if (payload.depositpaid !== undefined) {
    params.set('depositpaid', String(payload.depositpaid));
  }

  if (payload.bookingdates?.checkin !== undefined) {
    params.set('bookingdates[checkin]', payload.bookingdates.checkin);
  }

  if (payload.bookingdates?.checkout !== undefined) {
    params.set('bookingdates[checkout]', payload.bookingdates.checkout);
  }

  if (payload.additionalneeds !== undefined) {
    params.set('additionalneeds', payload.additionalneeds);
  }

  return params.toString();
}