/**
 * Squadre delle partite di un torneo a 4 (due semifinali, finale 3°/4°,
 * finale). Le finali, se non inserite a mano nel pannello, si ricavano dai
 * risultati delle semifinali: vincenti in finale, perdenti al 3°/4° posto.
 * Usato dalla striscia della diretta; il tabellone fa lo stesso calcolo.
 */
const TITOLI: Record<string, string> = { sf1: 'Semifinale 1', sf2: 'Semifinale 2', f34: 'Finale 3°/4° posto', f12: 'Finale' };

const nome = (ref: any, testo?: string) => (testo || ref?.nome || '').trim() || null;
const giocata = (p: any) => p && p.setCasa != null && p.setOspite != null && p.setCasa !== p.setOspite;

export function partiteTorneo(torneo: any): { fase: string; titolo: string; data?: string; casa: string | null; ospite: string | null }[] {
  const perFase = new Map<string, any>((torneo?.partite ?? []).map((p: any) => [p.fase, p]));
  const esito = (f: string) => {
    const p = perFase.get(f) ?? {};
    const a = nome(p.casa, p.casaNome), b = nome(p.ospite, p.ospiteNome);
    if (!giocata(p)) return { vincente: null, perdente: null };
    return p.setCasa > p.setOspite ? { vincente: a, perdente: b } : { vincente: b, perdente: a };
  };
  const sf1 = esito('sf1'), sf2 = esito('sf2');
  return ['sf1', 'sf2', 'f34', 'f12'].map((f) => {
    const p = perFase.get(f) ?? {};
    let casa = nome(p.casa, p.casaNome), ospite = nome(p.ospite, p.ospiteNome);
    if (f === 'f34') { casa ??= sf1.perdente; ospite ??= sf2.perdente; }
    if (f === 'f12') { casa ??= sf1.vincente; ospite ??= sf2.vincente; }
    return { fase: f, titolo: TITOLI[f], data: p.data, casa, ospite };
  });
}
