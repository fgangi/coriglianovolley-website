/**
 * Classifica letta da Legavolley al momento della pubblicazione del sito.
 *
 * La pagina della Lega non ha un formato "per programmi": è HTML pensato per
 * le persone. Qui si legge la tabella e si controlla che il risultato abbia
 * senso; se qualcosa non torna (pagina cambiata, sito irraggiungibile, dati
 * strani) si restituisce null e il sito usa la classifica inserita a mano nel
 * pannello. Il motivo finisce nel registro della pubblicazione di Cloudflare,
 * così si capisce cosa adattare.
 *
 * Colonne della tabella (ottobre 2026): posizione e squadra, punti, giocate,
 * vinte, perse, 3-0, 3-1, 3-2, 2-3, 1-3, 0-3, set vinti, set persi, punti
 * fatti, punti subiti, quoziente set, quoziente punti, squalifiche.
 */

export const URL_CLASSIFICA_LEGA = 'https://www.legavolley.it/classifica/?idCampionato=1002';

export type RigaClassifica = {
  posizione: number; squadra: string; punti: number;
  giocate: number; vinte: number; perse: number;
  setVinti: number; setPersi: number;
};
export type ClassificaLega = { righe: RigaClassifica[]; aggiornataAl: string | null; fonte: string };

const testo = (x: string) =>
  x.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s+/g, ' ').trim();
// "." è il modo della Lega di scrivere "nessun punto" (squadra che non ha ancora giocato)
const numero = (x: string) => (x === '.' ? 0 : /^-?\d+$/.test(x) ? Number(x) : NaN);

export function leggiClassifica(html: string): RigaClassifica[] {
  // Si parte dalla tabella che segue "Classifica aggiornata al": è la sola
  // tabella della pagina con le righe delle squadre
  const inizio = html.indexOf('Classifica aggiornata al');
  if (inizio < 0) throw new Error('intestazione "Classifica aggiornata al" non trovata');
  const fine = html.indexOf('</table>', inizio);
  const tabella = html.slice(inizio, fine > 0 ? fine : undefined);

  const righe: RigaClassifica[] = [];
  for (const [, riga] of tabella.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    if (!riga.includes('class="pos"')) continue; // intestazioni
    const celle = [...riga.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => testo(m[1]));
    const m = celle[0]?.match(/^(\d+)\s+(.+)$/);
    if (!m || celle.length < 13) throw new Error(`riga con formato inatteso: ${celle.slice(0, 3).join(' | ')}`);
    const [punti, giocate, vinte, perse] = celle.slice(1, 5).map(numero);
    const [setVinti, setPersi] = celle.slice(11, 13).map(numero);
    righe.push({ posizione: Number(m[1]), squadra: m[2], punti, giocate, vinte, perse, setVinti, setPersi });
  }
  return righe;
}

/** Controlli di buon senso: meglio nessun dato che dati sbagliati. */
function verifica(righe: RigaClassifica[]) {
  if (righe.length < 6 || righe.length > 20) throw new Error(`numero di squadre insolito: ${righe.length}`);
  if (!righe.some((r) => /corigliano/i.test(r.squadra))) throw new Error('il Corigliano non è in classifica');
  for (const r of righe) {
    const valori = [r.punti, r.giocate, r.vinte, r.perse, r.setVinti, r.setPersi];
    if (valori.some((v) => !Number.isFinite(v) || v < 0)) throw new Error(`valori non validi per ${r.squadra}`);
    if (r.vinte + r.perse !== r.giocate) throw new Error(`vinte + perse diverso da giocate per ${r.squadra}`);
  }
}

export async function classificaDallaLega(url = URL_CLASSIFICA_LEGA): Promise<ClassificaLega | null> {
  try {
    const risposta = await fetch(url, { signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'coriglianovolley.it (aggiornamento classifica)' } });
    if (!risposta.ok) throw new Error(`risposta ${risposta.status}`);
    const html = await risposta.text();
    const righe = leggiClassifica(html);
    verifica(righe);
    // La data sta subito dopo l'intestazione, ma in mezzo può esserci HTML
    const intestazione = testo(html.slice(html.indexOf('Classifica aggiornata al'), html.indexOf('Classifica aggiornata al') + 1000));
    const data = intestazione.match(/Classifica aggiornata al\D{0,40}?(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    const due = (x: string) => x.padStart(2, '0');
    // Se la data non si trova, vale quella di oggi: la classifica è stata appena letta
    if (!data) console.warn('[classifica] data della Lega non trovata, uso quella di oggi');
    const oggi = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
    return { righe, aggiornataAl: data ? `${data[3]}-${due(data[2])}-${due(data[1])}` : oggi, fonte: url };
  } catch (e) {
    console.warn(`[classifica] lettura da Legavolley non riuscita, uso quella del pannello: ${(e as Error).message}`);
    return null;
  }
}
