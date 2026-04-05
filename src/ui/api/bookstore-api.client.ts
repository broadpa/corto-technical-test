import { APIRequestContext, APIResponse } from '@playwright/test';

export type Credentials = {
  userName: string;
  password: string;
};

export class BookStoreApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/Account/v1/User', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: credentials,
    });
  }

  async generateToken(credentials: Credentials): Promise<APIResponse> {
    return this.request.post('/Account/v1/GenerateToken', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: credentials,
    });
  }

  async addBook(
    userId: string,
    isbn: string,
    token: string,
  ): Promise<APIResponse> {
    return this.request.post('/BookStore/v1/Books', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId,
        collectionOfIsbns: [{ isbn }],
      },
    });
  }

  async deleteBook(
    userId: string,
    isbn: string,
    token: string,
  ): Promise<APIResponse> {
    return this.request.delete('/BookStore/v1/Book', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        isbn,
        userId,
      },
    });
  }

  async deleteUser(userId: string, token: string): Promise<APIResponse> {
    return this.request.delete(`/Account/v1/User/${userId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }
}