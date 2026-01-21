import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler'],

        ],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600, // Increase limit to 600 kB to accommodate React core
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into separate chunks
          if (id.includes('node_modules')) {
            // Core React libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-is')) {
              return 'vendor-react-core';
            }

            // React Router
            if (id.includes('react-router')) {
              return 'vendor-react-router';
            }

            // Redux
            if (id.includes('react-redux') || id.includes('@reduxjs/toolkit')) {
              return 'vendor-redux';
            }

            // Charts
            if (id.includes('recharts')) {
              return 'vendor-recharts';
            }

            // Icons
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }

            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-radix-ui';
            }

            // Form libraries
            if (id.includes('react-hook-form') || id.includes('@hookform/resolvers')) {
              return 'vendor-forms';
            }

            // Table library
            if (id.includes('@tanstack/react-table')) {
              return 'vendor-table';
            }

            // Map libraries
            if (id.includes('@react-google-maps') || id.includes('react-leaflet') || id.includes('leaflet')) {
              return 'vendor-maps';
            }

            // Date utilities
            if (id.includes('date-fns') || id.includes('react-day-picker')) {
              return 'vendor-date';
            }

            // Command palette
            if (id.includes('cmdk')) {
              return 'vendor-cmdk';
            }

            // Other utilities
            if (id.includes('zod') || id.includes('clsx') || id.includes('tailwind-merge') ||
              id.includes('class-variance-authority')) {
              return 'vendor-utils';
            }

            // Remaining node_modules
            return 'vendor-other';
          }

          // Split application code by route/feature
          if (id.includes('/src/pages/')) {
            const pageName = id.split('/src/pages/')[1].split('/')[0];
            return `page-${pageName}`;
          }
        }
      }
    }
  }
})


