import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        // Precachea absolutamente todo lo generado en el build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        // Fuerza a que el nuevo SW tome el control inmediatamente al actualizar
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: 'Entrenamiento de Bloqueo',
        short_name: 'Bloqueo VB',
        description: 'Herramienta de entrenamiento de bloqueo en voleibol mediante estímulos visuales',
        theme_color: '#111111',
        background_color: '#ffffff',
        display: 'fullscreen',
        orientation: 'landscape',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // Permite probar el Service Worker con `npm run dev`, no solo en build
      devOptions: {
        enabled: true,
      },
    }),
  ],
});