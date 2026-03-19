import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@icon\/(.*)/, replacement: path.resolve(__dirname, './src/assets/icons/$1') },
      { find: /^@type\/(.*)/, replacement: path.resolve(__dirname, './src/types/$1') },
      { find: /^@store\/(.*)/, replacement: path.resolve(__dirname, './src/store/$1') },
      { find: /^@hooks\/(.*)/, replacement: path.resolve(__dirname, './src/hooks/$1') },
      { find: /^@constants\/(.*)/, replacement: path.resolve(__dirname, './src/constants/$1') },
      { find: /^@api\/(.*)/, replacement: path.resolve(__dirname, './src/api/$1') },
      { find: /^@components\/(.*)/, replacement: path.resolve(__dirname, './src/components/$1') },
      { find: /^@utils\/(.*)/, replacement: path.resolve(__dirname, './src/utils/$1') },
      { find: /^@src\/(.*)/, replacement: path.resolve(__dirname, './src/$1') },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
