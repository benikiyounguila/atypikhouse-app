import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/', 
    server: {
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: true,
      manifest: true,
      outDir: 'dist',
      rollupOptions: {
        input: {
          client: path.resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    },
    ssr: {
      noExternal: ['react-helmet-async', 'react-toastify', 'axios'],
    },
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.VITE_BASE_URL || 'http://localhost:5000/api'),
    },
  };
});
