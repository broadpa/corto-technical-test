import { APIRequestContext, APIResponse } from '@playwright/test';
import { BookingPayload, BookingQuery } from '../types/booking';
import { formHeaders, jsonHeaders, withToken, xmlHeaders } from '../utils/headers';
import { toBookingForm, toBookingXml } from '../utils/serializers';

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  async getBookingIds(query?: BookingQuery): Promise<APIResponse> {
    const params: Record<string, string> = {};

    if (query?.firstname) {
      params.firstname = query.firstname;
    }

    if (query?.lastname) {
      params.lastname = query.lastname;
    }

    if (query?.checkin) {
      params.checkin = query.checkin;
    }

    if (query?.checkout) {
      params.checkout = query.checkout;
    }

    return this.request.get('/booking', {
      params: Object.keys(params).length ? params : undefined,
    });
  }

  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    return this.createBookingJson(payload);
  }

  async createBookingJson(payload: BookingPayload): Promise<APIResponse> {
    return this.request.post('/booking', {
      headers: jsonHeaders,
      data: payload,
    });
  }

  async createBookingXml(payload: BookingPayload): Promise<APIResponse> {
    return this.request.post('/booking', {
      headers: xmlHeaders,
      data: toBookingXml(payload),
    });
  }

  async createBookingForm(payload: BookingPayload): Promise<APIResponse> {
    return this.request.post('/booking', {
      headers: formHeaders,
      data: toBookingForm(payload),
    });
  }

  async updateBooking(
    id: number,
    payload: BookingPayload,
    token?: string,
  ): Promise<APIResponse> {
    return this.updateBookingJson(id, payload, token);
  }

  async updateBookingJson(
    id: number,
    payload: BookingPayload,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: withToken(jsonHeaders, token),
      data: payload,
    });
  }

  async updateBookingXml(
    id: number,
    payload: BookingPayload,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: withToken(xmlHeaders, token),
      data: toBookingXml(payload),
    });
  }

  async updateBookingForm(
    id: number,
    payload: BookingPayload,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: withToken(formHeaders, token),
      data: toBookingForm(payload),
    });
  }

  async partialUpdateBooking(
    id: number,
    payload: Partial<BookingPayload>,
    token?: string,
  ): Promise<APIResponse> {
    return this.partialUpdateBookingJson(id, payload, token);
  }

  async partialUpdateBookingJson(
    id: number,
    payload: Partial<BookingPayload>,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      headers: withToken(jsonHeaders, token),
      data: payload,
    });
  }

  async partialUpdateBookingXml(
    id: number,
    payload: Partial<BookingPayload>,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      headers: withToken(xmlHeaders, token),
      data: toBookingXml(payload),
    });
  }

  async partialUpdateBookingForm(
    id: number,
    payload: Partial<BookingPayload>,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      headers: withToken(formHeaders, token),
      data: toBookingForm(payload),
    });
  }

  async deleteBooking(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : undefined,
    });
  }
}