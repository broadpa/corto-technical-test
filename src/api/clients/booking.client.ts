import { APIRequestContext, APIResponse } from '@playwright/test';
import { BookingPayload } from '../types/booking';

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  async getBooking(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async createBooking(payload: BookingPayload): Promise<APIResponse> {
    return this.request.post('/booking', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: payload,
    });
  }

  async updateBooking(
    id: number,
    payload: BookingPayload,
    token: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
      data: payload,
    });
  }

  async partialUpdateBooking(
    id: number,
    payload: Partial<BookingPayload>,
    token: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
      data: payload,
    });
  }

  async deleteBooking(id: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }
}