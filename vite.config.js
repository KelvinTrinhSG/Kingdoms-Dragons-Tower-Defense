import { defineConfig } from 'vite';

// GitHub Pages serves the game from the repo subpath.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Kingdoms-Dragons-Tower-Defense/' : '/',
  build: {
    chunkSizeWarningLimit: 2000,
  },
  test: {
    include: ['tests/**/*.test.js'],
  },
}));
