import type { APIRoute } from 'astro';
import { sfetch } from '../lib/sanity';
import { newsSlugsQuery } from '../lib/queries';

/**
 * Mappa del sito per i motori di ricerca, generata a ogni pubblicazione: le
 * pagine fisse più tutte le news. La gallery compare solo quando ha almeno un
 * album, come la sua voce di menu.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://coriglianovolley.it');
  const [news, album] = await Promise.all([
    sfetch<{ slug: string }[]>(newsSlugsQuery, {}, []),
    sfetch<number>('count(*[_type == "galleryAlbum"])', {}, 0),
  ]);
  const percorsi = [
    '/', '/squadra/', '/squadra/chi-siamo/', '/partite/', '/news/',
    '/settore-giovanile/', '/sponsor/', '/contatti/',
    ...(album > 0 ? ['/gallery/'] : []),
    ...news.filter((n) => n.slug).map((n) => `/news/${n.slug}/`),
  ];
  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${percorsi.map((p) => `  <url><loc>${new URL(p, base).href}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(corpo, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
