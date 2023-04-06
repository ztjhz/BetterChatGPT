import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
   // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
  resolve: {
    alias: {
      '@icon/': new URL('./src/assets/icons/', import.meta.url).pathname,
      '@type/': new URL('./src/types/', import.meta.url).pathname,
      '@store/': new URL('./src/store/', import.meta.url).pathname,
      '@hooks/': new URL('./src/hooks/', import.meta.url).pathname,
      '@constants/': new URL('./src/constants/', import.meta.url).pathname,
      '@api/': new URL('./src/api/', import.meta.url).pathname,
      '@components/': new URL('./src/components/', import.meta.url).pathname,
      '@utils/': new URL('./src/utils/', import.meta.url).pathname,
      '@src/': new URL('./src/', import.meta.url).pathname,
    },
  },
  base: '/FreeChatGPT/',
});
