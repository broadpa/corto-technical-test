import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_PASSWORD, API_USERNAME } from '../../config/env';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async createToken(
    username: string = API_USERNAME,
    password: string = API_PASSWORD,
  ): Promise<APIResponse> {
    return this.request.post('/auth', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: { username, password },
    });
  }

  async getToken(
    username: string = API_USERNAME,
    password: string = API_PASSWORD,
  ): Promise<string | undefined> {
    const response = await this.createToken(username, password);
    const body = (await response.json()) as { token?: string };
    return body.token;
  }
}