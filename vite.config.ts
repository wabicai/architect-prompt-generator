import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

// Plugin to copy extension files after build
function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');

      // Copy manifest.json
      copyFileSync(
        path.resolve(__dirname, 'manifest.json'),
        path.resolve(distDir, 'manifest.json')
      );

      // Copy background.js
      copyFileSync(
        path.resolve(__dirname, 'background.js'),
        path.resolve(distDir, 'background.js')
      );
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), copyExtensionFiles()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
          },
          output: {
            entryFileNames: 'assets/[name].js',
            chunkFileNames: 'assets/[name].js',
            assetFileNames: 'assets/[name].[ext]'
          }
        }
      }
    };
});
