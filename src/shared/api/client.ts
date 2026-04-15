import type { CreateClientConfig } from './generated/client.gen';

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const internalApiUrl = process.env.INTERNAL_API_URL ?? publicApiUrl;

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: typeof window === 'undefined' ? internalApiUrl : publicApiUrl,
  credentials: 'include',
});
