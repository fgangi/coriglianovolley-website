import sharp from 'sharp';

/**
 * I file dei loghi hanno margini trasparenti molto diversi fra loro: alcuni
 * riempiono tutto il file, altri lasciano l'85% di vuoto attorno al disegno.
 * A parità di dimensioni impostate, il secondo appare molto più piccolo.
 *
 * Qui si misura una volta per logo dove finisce davvero il disegno, e si
 * chiede al server delle immagini di consegnare solo quella porzione. Così
 * l'uniformità non dipende da come è stato salvato il file.
 */

type Rect = { left: number; top: number; width: number; height: number };
const cache = new Map<string, Rect | null>();

/** Dimensioni originali, lette dal riferimento: image-<id>-<w>x<h>-<est> */
function dimensioni(ref: string) {
  const m = ref.match(/-(\d+)x(\d+)-/);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : null;
}

function urlBase(ref: string, pid: string, ds: string) {
  const [, id, dim, ext] = ref.split('-');
  return `https://cdn.sanity.io/images/${pid}/${ds}/${id}-${dim}.${ext}`;
}

/**
 * Rettangolo del disegno, in pixel dell'immagine originale.
 * Restituisce null se il logo non ha trasparenza o se qualcosa va storto:
 * in quel caso si usa l'immagine intera, senza peggiorare nulla.
 */
export async function rettangoloDisegno(
  source: any, pid: string, ds: string,
): Promise<Rect | null> {
  const ref: string | undefined = source?.asset?._ref;
  if (!ref) return null;
  if (cache.has(ref)) return cache.get(ref)!;

  let esito: Rect | null = null;
  try {
    const orig = dimensioni(ref);
    if (!orig) throw new Error('dimensioni sconosciute');

    // Basta una copia piccola per trovare i bordi: si lavora su 400px
    const LARGA = 400;
    const risposta = await fetch(`${urlBase(ref, pid, ds)}?w=${LARGA}`);
    const buf = Buffer.from(await risposta.arrayBuffer());
    const img = sharp(buf);
    const meta = await img.metadata();

    // Due casi: chi ha la trasparenza si taglia sul vuoto, chi non ce l'ha
    // si taglia sul colore di fondo (preso dall'angolo dell'immagine). Il
    // secondo caso è il più frequente: molti loghi arrivano su fondo bianco
    // con margini larghissimi, e senza questo apparirebbero minuscoli.
    const { info } = meta.hasAlpha
      ? await img.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
          .toBuffer({ resolveWithObject: true })
      : await img.trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });

    const scala = orig.w / (meta.width ?? LARGA);
    const left = Math.max(0, Math.round(Math.abs(info.trimOffsetLeft ?? 0) * scala));
    const top = Math.max(0, Math.round(Math.abs(info.trimOffsetTop ?? 0) * scala));
    const width = Math.min(orig.w - left, Math.round(info.width * scala));
    const height = Math.min(orig.h - top, Math.round(info.height * scala));

    // Un ritaglio degenere non serve, e uno che divora quasi tutto è sospetto:
    // meglio lasciare il logo intero che consegnarne un frammento.
    const quota = (width * height) / (orig.w * orig.h);
    if (width > 8 && height > 8 && quota > 0.02
        && (width < orig.w * 0.98 || height < orig.h * 0.98)) {
      esito = { left, top, width, height };
    }
  } catch {
    esito = null;
  }
  cache.set(ref, esito);
  return esito;
}

/**
 * Indirizzo del logo già privo dei margini vuoti, più le sue proporzioni reali.
 * Le proporzioni servono a dare a ogni logo la stessa superficie.
 */
export async function logoRifilato(source: any, pid: string, ds: string, larghezza = 420) {
  const ref: string | undefined = source?.asset?._ref;
  if (!ref) return null;
  const r = await rettangoloDisegno(source, pid, ds);
  const orig = dimensioni(ref);
  const base = urlBase(ref, pid, ds);
  if (!r || !orig) {
    return { url: `${base}?w=${larghezza}&auto=format`, prop: orig ? orig.w / orig.h : 1 };
  }
  return {
    url: `${base}?rect=${r.left},${r.top},${r.width},${r.height}&w=${larghezza}&auto=format`,
    prop: r.width / r.height,
  };
}
