import { BookingPayload } from '../types/booking';

export function withUniqueGuest(
  payload: BookingPayload,
  suffix: string = Date.now().toString(),
): BookingPayload {
  return {
    ...payload,
    firstname: `${payload.firstname}-${suffix}`,
    lastname: `${payload.lastname}-${suffix}`,
  };
}