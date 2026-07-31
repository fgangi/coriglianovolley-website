import { defineType, defineField } from 'sanity';

/** Impostazioni generali del sito. Documento unico (singleton). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Impostazioni sito',
  type: 'document',
  fields: [
    defineField({
      name: 'nomeSquadra',
      title: 'Nome squadra',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'loghiLega',
      title: 'Loghi obbligatori Lega (Serie A3)',
      type: 'object',
      description:
        'Loghi richiesti dalla Lega. Carica i file e i link quando la Lega fornisce materiali e indicazioni: compaiono automaticamente in home / sponsor.',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'legaCredemLogo', title: 'Logo congiunto Lega / Credem Banca', type: 'image', options: { hotspot: true } },
        { name: 'legaCredemUrl', title: 'Link sito Main Sponsor (Credem Banca)', type: 'url' },
        { name: 'legaLogo', title: 'Logo Lega Pallavolo Serie A (orizzontale)', type: 'image', options: { hotspot: true } },
        { name: 'legaUrl', title: 'Link sito Lega Pallavolo Serie A', type: 'url' },
        { name: 'fipavLogo', title: 'Logo FIPAV', type: 'image', options: { hotspot: true } },
        { name: 'fipavUrl', title: 'Link sito FIPAV', type: 'url' },
        { name: 'mikasaLogo', title: 'Logo Mikasa', type: 'image', options: { hotspot: true } },
        { name: 'mikasaUrl', title: 'Link sito Mikasa', type: 'url' },
      ],
    }),
    defineField({
      name: 'stagione',
      title: 'Stagione in corso',
      type: 'string',
      description: 'Es. 2026/2027',
    }),
    defineField({
      name: 'storia',
      title: 'La nostra storia (pagina Chi siamo)',
      type: 'blockContent',
      description: 'Testo di presentazione della società, mostrato nella pagina "Chi siamo".',
    }),
    defineField({
      name: 'fotoSquadra',
      title: 'Foto di squadra',
      type: 'image',
      options: { hotspot: true },
      description: 'Foto di gruppo mostrata nelle pagine Squadra e Chi siamo.',
    }),
    defineField({
      name: 'prossimaPartita',
      title: 'Prossima partita (in evidenza in home)',
      type: 'reference',
      to: [{ type: 'partita' }],
    }),
    defineField({
      name: 'bigliettiUrl',
      title: 'Link biglietteria esterna',
      type: 'url',
    }),
    defineField({
      name: 'newsletterUrl',
      title: 'Link iscrizione newsletter',
      type: 'url',
    }),
    defineField({
      name: 'direttaUrl',
      title: 'Canale diretta / YouTube',
      type: 'url',
      description: 'Link al canale YouTube o alla diretta della squadra. Usato per il pulsante "Guarda la diretta".',
    }),
    defineField({
      name: 'email',
      title: 'Email di contatto',
      type: 'string',
    }),
    defineField({
      name: 'pec',
      title: 'PEC',
      type: 'string',
      description: 'Posta elettronica certificata (es. societa@pec.it).',
    }),
    defineField({
      name: 'telefoni',
      title: 'Telefoni',
      type: 'array',
      description: 'Puoi inserire più numeri: usa "Aggiungi" per ognuno.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'etichetta',
              title: 'Etichetta',
              type: 'string',
              description: 'Es. Segreteria, Ufficio stampa, Biglietteria (facoltativa).',
            },
            {
              name: 'numero',
              title: 'Numero',
              type: 'string',
              validation: (r: any) => r.required(),
            },
          ],
          preview: {
            select: { numero: 'numero', etichetta: 'etichetta' },
            prepare: ({ numero, etichetta }: any) => ({ title: numero, subtitle: etichetta }),
          },
        },
      ],
    }),
    defineField({
      name: 'indirizzo',
      title: 'Indirizzo / palazzetto',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'mappaPosizione',
      title: 'Mappa (Google Maps)',
      type: 'text',
      rows: 3,
      description:
        'Da Google Maps: Condividi → "Incorpora una mappa" → Copia HTML, e incolla qui il codice. In alternativa puoi inserire coordinate "lat,lng" o il nome del luogo. Se vuoto viene usato l\'indirizzo qui sopra.',
    }),
    defineField({
      name: 'social',
      title: 'Social',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'facebook', type: 'url', title: 'Facebook' },
        { name: 'youtube', type: 'url', title: 'YouTube' },
        { name: 'x', type: 'url', title: 'X (Twitter)' },
        { name: 'tiktok', type: 'url', title: 'TikTok' },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Impostazioni sito' }),
  },
});
