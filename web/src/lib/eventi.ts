import { FUSO } from './sanity';

/**
 * Date degli eventi. Nel pannello sono giorni senza ora ("2026-09-26"): si
 * leggono a mezzogiorno UTC, così il fuso non le sposta mai al giorno prima.
 */
const giorno = (d: string) => new Date(`${d}T12:00:00Z`);
const fmt = (d: string, opt: Intl.DateTimeFormatOptions) => giorno(d).toLocaleDateString('it-IT', { ...opt, timeZone: 'UTC' });

/** "26–27 settembre 2026", "30 settembre – 2 ottobre 2026", "12 luglio 2026" */
export function dateEvento(inizio?: string, fine?: string): string {
  if (!inizio) return '';
  if (!fine || fine === inizio) return fmt(inizio, { day: 'numeric', month: 'long', year: 'numeric' });
  const [ai, mi] = inizio.split('-'), [af, mf] = fine.split('-');
  if (ai === af && mi === mf) return `${fmt(inizio, { day: 'numeric' })}–${fmt(fine, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  if (ai === af) return `${fmt(inizio, { day: 'numeric', month: 'long' })} – ${fmt(fine, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  return `${fmt(inizio, { day: 'numeric', month: 'long', year: 'numeric' })} – ${fmt(fine, { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

/** Giorno per il programma: "Sabato 26 settembre" */
export function giornoProgramma(d: string): string {
  const s = fmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Oggi a Corigliano, come "YYYY-MM-DD" */
export function oggi(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: FUSO });
}

/**
 * Un evento è "in programma" finché non è passato il suo ultimo giorno. Il
 * sito è statico: lo stato si aggiorna a ogni pubblicazione (almeno una volta
 * a settimana, con l'aggiornamento della classifica).
 */
export const inProgramma = (e: any, adesso = oggi()) => (e.dataFine || e.dataInizio) >= adesso;

/** In programma prima (dal più vicino), poi i passati (dal più recente). */
export function ordinaEventi(eventi: any[]) {
  const adesso = oggi();
  const futuri = eventi.filter((e) => inProgramma(e, adesso)).sort((a, b) => a.dataInizio.localeCompare(b.dataInizio));
  const passati = eventi.filter((e) => !inProgramma(e, adesso)).sort((a, b) => b.dataInizio.localeCompare(a.dataInizio));
  return { futuri, passati };
}

export const TIPI: Record<string, string> = { organizzato: 'Organizzato da noi', partecipazione: 'Partecipazione' };

/** Link a Google Maps dal testo del luogo */
export const mappaLuogo = (luogo?: string) =>
  luogo ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(luogo)}` : null;
