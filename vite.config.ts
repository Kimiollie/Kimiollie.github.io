/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Puts the room background URLs into index.html, so its early day/night script can preload
 * the right one before the app starts. In the build the URLs have content hashes.
 */
function roomPreload(): Plugin {
  const names = { __ROOM_DAY_URL__: 'room_day_empty', __ROOM_NIGHT_URL__: 'room_night_empty' };
  return {
    name: 'room-preload',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        let out = html;
        for (const [token, name] of Object.entries(names)) {
          let url = `/src/assets/room/${name}.webp`;
          if (ctx.bundle) {
            const file = Object.values(ctx.bundle).find(
              (chunk) => chunk.type === 'asset' && chunk.fileName.startsWith(`assets/${name}-`),
            );
            if (!file) throw new Error(`room-preload: ${name} not found in the build`);
            url = `/${file.fileName}`;
          }
          out = out.replaceAll(token, url);
        }
        return out;
      },
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), roomPreload()],
  test: {
    environment: 'jsdom',
  },
});
