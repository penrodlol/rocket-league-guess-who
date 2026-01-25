import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [nitro(), viteTsConfigPaths({ projects: ['./tsconfig.json'] }), tailwindcss(), tanstackStart(), viteReact()],
  server: { allowedHosts: ['you-bald-foto-enemies.trycloudflare.com'] },
});

export default config;
