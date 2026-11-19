import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemaTypes';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

/**
 * Struttura del pannello: "Impostazioni sito" come documento unico, poi i
 * contenuti in gruppi. Un tipo di contenuto non elencato qui finisce comunque
 * in fondo: prima un modulo nuovo (Eventi) esisteva ma non aveva una voce.
 */
const VOCI: [string, string][][] = [
  [['news', 'Notizie'], ['evento', 'Eventi']],
  [['partita', 'Partite'], ['squadraAvversaria', 'Squadre del girone'], ['classifica', 'Classifica'], ['torneo', 'Tornei (tabelloni)']],
  [['giocatore', 'Roster'], ['staff', 'Staff'], ['squadraGiovanile', 'Settore giovanile']],
  [['sponsor', 'Sponsor'], ['galleryAlbum', 'Gallery']],
];
const elencati = new Set(['siteSettings', ...VOCI.flat().map(([tipo]) => tipo)]);
const structure = (S: any) =>
  S.list()
    .title('Contenuti')
    .items([
      S.listItem()
        .title('⚙️ Impostazioni sito')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      ...VOCI.flatMap((gruppo) => [S.divider(), ...gruppo.map(([tipo, titolo]) => S.documentTypeListItem(tipo).title(titolo))]),
      ...S.documentTypeListItems().filter((voce: any) => !elencati.has(voce.getId())),
    ]);

export default defineConfig({
  name: 'coriglianovolley',
  title: 'Corigliano Volley',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Nasconde "Impostazioni sito" dal menu "crea nuovo" (è un singleton).
    templates: (templates) => templates.filter((t) => t.schemaType !== 'siteSettings'),
  },
});
