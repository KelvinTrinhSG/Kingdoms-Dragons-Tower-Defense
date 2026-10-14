import { defineConfig } from 'vite';

// GitHub Pages serves the game from the repo subpath; `npm run preview` mirrors it.
// `npm run dev` stays at the root (http://localhost:5173/).
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/Kingdoms-Dragons-Tower-Defense/' : '/',
  build: {
    chunkSizeWarningLimit: 2000,
  },
  test: {
    include: ['tests/**/*.test.js'],
  },
}));
