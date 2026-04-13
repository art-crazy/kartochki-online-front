import { defineConfig } from '@hey-api/openapi-ts';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default defineConfig({
  input: `${apiUrl}/openapi/openapi.yaml`,
  output: {
    path: 'src/shared/api/generated',
    postProcess: ['prettier'],
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: '../client',
    },
    '@tanstack/react-query',
  ],
});
