import { defineType, defineField } from 'sanity';

/** Notizia / articolo. */
export const news = defineType({
  name: 'news',
  title: 'Notizia',
  type: 'document',
  fields: [
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (indirizzo pagina)',
      type: 'slug',
      options: { source: 'titolo', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'data',
      title: 'Data di pubblicazione',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'settore',
      title: 'Sezione',
      type: 'string',
      options: {
        list: [
          { title: 'Prima squadra', value: 'prima-squadra' },
          { title: 'Settore giovanile', value: 'giovanile' },
        ],
        layout: 'radio',
      },
      initialValue: 'prima-squadra',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'copertina', title: 'Immagine di copertina', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'estratto',
      title: 'Estratto',
      type: 'text',
      rows: 3,
      description: 'Breve riassunto mostrato nelle anteprime.',
    }),
    defineField({ name: 'corpo', title: 'Testo', type: 'blockContent' }),
    defineField({
      name: 'inEvidenza',
      title: 'In evidenza in home',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'Più recenti', name: 'dataDesc', by: [{ field: 'data', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titolo', subtitle: 'settore', media: 'copertina', data: 'data' },
    prepare: ({ title, subtitle, media, data }) => ({
      title,
      subtitle: `${subtitle === 'giovanile' ? 'Giovanile' : 'Prima squadra'}${data ? ' · ' + new Date(data).toLocaleDateString('it-IT') : ''}`,
      media,
    }),
  },
});
