import { defineType, defineField } from 'sanity';

/**
 * Classifica del girone. Due modalità:
 *  - immagine: screenshot preso da legavolley.it (aggiornamento più rapido)
 *  - tabella: righe compilate a mano (look "nativo")
 */
export const classifica = defineType({
  name: 'classifica',
  title: 'Classifica',
  type: 'document',
  fields: [
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', initialValue: 'Classifica Serie A3' }),
    defineField({
      name: 'aggiornataAl',
      title: 'Aggiornata al',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'modalita',
      title: 'Modalità',
      type: 'string',
      options: {
        list: [
          { title: 'Immagine (screenshot)', value: 'immagine' },
          { title: 'Tabella compilata', value: 'tabella' },
        ],
        layout: 'radio',
      },
      initialValue: 'immagine',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'immagine',
      title: 'Immagine classifica',
      type: 'image',
      hidden: ({ document }) => document?.modalita !== 'immagine',
    }),
    defineField({
      name: 'righe',
      title: 'Righe classifica',
      type: 'array',
      hidden: ({ document }) => document?.modalita !== 'tabella',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'squadra', type: 'string', title: 'Squadra' },
            { name: 'punti', type: 'number', title: 'Punti' },
            { name: 'giocate', type: 'number', title: 'Giocate' },
            { name: 'vinte', type: 'number', title: 'Vinte' },
            { name: 'perse', type: 'number', title: 'Perse' },
          ],
          preview: {
            select: { squadra: 'squadra', punti: 'punti' },
            prepare: ({ squadra, punti }) => ({ title: squadra, subtitle: `${punti ?? 0} punti` }),
          },
        },
      ],
    }),
    defineField({
      name: 'linkUfficiale',
      title: 'Link classifica ufficiale (Legavolley)',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'titolo', data: 'aggiornataAl' },
    prepare: ({ title, data }) => ({
      title: title || 'Classifica',
      subtitle: data ? 'Aggiornata al ' + new Date(data).toLocaleDateString('it-IT') : '',
    }),
  },
});
