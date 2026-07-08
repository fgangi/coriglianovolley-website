import { sanityClient } from 'sanity:client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';

const client = sanityClient;
const builder = createImageUrlBuilder(client);

/** URL di un'immagine Sanity, con trasformazioni a catena. */
export function urlFor(source: any) {
  return builder.image(source);
}

/** Immagine pronta all'uso (o null se assente). */
export function img(source: any, w = 800, h?: number): string | null {
  if (!source?.asset) return null;
  let b = urlFor(source).width(w).auto('format').fit('max');
  if (h) b = b.height(h).fit('crop');
  return b.url();
}

/**
 * Esegue una query GROQ. Se il progetto Sanity non è ancora collegato
 * (ID placeholder o rete non disponibile) restituisce il fallback,
 * così il sito continua a renderizzare gli stati "vuoti".
 */
export async function sfetch<T>(query: string, params: Record<string, any> = {}, fallback: T): Promise<T> {
  try {
    return await client.fetch<T>(query, params);
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[sanity] query non riuscita (progetto non collegato?):', (err as Error).message);
    }
    return fallback;
  }
}

/** Converte il testo ricco (Portable Text) in HTML. */
export function richText(blocks: any): string {
  if (!blocks) return '';
  try {
    return toHTML(blocks, {
      components: {
        marks: {
          link: ({ children, value }: any) =>
            `<a href="${value?.href ?? '#'}" target="_blank" rel="noopener">${children}</a>`,
        },
      },
    });
  } catch {
    return '';
  }
}

/** Data in formato italiano leggibile. */
export function formatData(iso?: string, withTime = false): string {
  if (!iso) return '';
  const d = new Date(iso);
  const opt: Intl.DateTimeFormatOptions = withTime
    ? { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('it-IT', opt);
}
