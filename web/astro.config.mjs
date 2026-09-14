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


// Solo in sviluppo: fa rispondere il dev server come Cloudflare Pages.
// Online un indirizzo senza slash finale viene reindirizzato a quello con
// lo slash (/squadra -> /squadra/), e un indirizzo inesistente mostra la
// pagina 404 del sito. Il dev server di Astro invece rispondeva con la sua
// pagina "404: Not Found" a qualsiasi indirizzo senza slash, anche alle
// pagine che esistono. È un plugin di Vite "pre": così passa prima di Astro.
const slashFinaleComeOnline = {
  name: 'slash-finale-come-online',
  // Astro mette in cima alla catena la propria regola sullo slash all'ultimo
  // momento (nella fase finale dei plugin). Questo plugin gira dopo il suo e
  // si inserisce davanti, altrimenti la richiesta non gli arriverebbe mai.
  enforce: 'post',
  apply: 'serve',
  configureServer(server) {
    return () => {
      server.middlewares.stack.unshift({ route: '', handle: (req, res, next) => {
        const [percorso, query] = (req.url ?? '').split('?');
        const interno = /^\/(@|_astro|node_modules|src\/)/.test(percorso) || percorso.startsWith('/__');
        const file = /\.[a-z0-9]+$/i.test(percorso);
        if (!interno && !file && percorso !== '/' && !percorso.endsWith('/')) {
          res.statusCode = 308;
          res.setHeader('Location', `${percorso}/${query ? `?${query}` : ''}`);
          res.end();
          return;
        }
        next();
      } });
    };
  },
};

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
  vite: { plugins: [slashFinaleComeOnline] },
});
