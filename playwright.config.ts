import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.pl.tsx',
  
  use: {
    baseURL: 'http://localhost:4000',
  },
});
