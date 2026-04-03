export const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export const xmlHeaders = {
  'Content-Type': 'text/xml',
  Accept: 'application/xml',
};

export const formHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/x-www-form-urlencoded',
};

export function withToken(
  headers: Record<string, string>,
  token?: string,
): Record<string, string> {
  return token ? { ...headers, Cookie: `token=${token}` } : headers;
}