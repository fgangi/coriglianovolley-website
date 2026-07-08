import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemaTypes';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

/** Struttura del pannello: "Impostazioni sito" come documento unico. */
const structure = (S: any) =>
  S.list()
    .title('Contenuti')
    .items([
      S.listItem()
        .title('⚙️ Impostazioni sito')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('news').title('Notizie'),
      S.documentTypeListItem('partita').title('Partite'),
      S.documentTypeListItem('classifica').title('Classifica'),
      S.divider(),
      S.documentTypeListItem('giocatore').title('Roster'),
      S.documentTypeListItem('staff').title('Staff'),
      S.documentTypeListItem('squadraGiovanile').title('Settore giovanile'),
      S.divider(),
      S.documentTypeListItem('sponsor').title('Sponsor'),
      S.documentTypeListItem('galleryAlbum').title('Gallery'),
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
