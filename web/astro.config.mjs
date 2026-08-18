// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import react from '@astrojs/react';
import sanity from '@sanity/astro';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV || 'development',
  process.cwd(),
  ''
);

// https://astro.build/config
export default defineConfig({
  site: 'https://coriglianovolley.it',
  // Le pagine sono servite con lo slash finale: allinea dev e produzione
  // ed evita i redirect 308 che rompevano la cronologia del browser.
  trailingSlash: 'always',
  // Espone il dev server sulla rete locale (test da mobile via IP del PC).
  server: { host: true },
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      apiVersion: '2024-10-01',
      // In sviluppo leggiamo dati freschi; in produzione la build è statica.
      useCdn: false,
      // Pannello redazione raggiungibile su /admin
      studioBasePath: '/admin',
    }),
    react(),
  ],
});
