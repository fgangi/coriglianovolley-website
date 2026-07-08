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
      name: 'stagione',
      title: 'Stagione in corso',
      type: 'string',
      description: 'Es. 2026/2027',
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
      name: 'email',
      title: 'Email di contatto',
      type: 'string',
    }),
    defineField({
      name: 'telefono',
      title: 'Telefono',
      type: 'string',
    }),
    defineField({
      name: 'indirizzo',
      title: 'Indirizzo / palazzetto',
      type: 'text',
      rows: 2,
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
