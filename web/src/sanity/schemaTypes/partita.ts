import { defineType, defineField } from 'sanity';

/** Partita: usata per calendario, risultati e "prossima partita". */
export const partita = defineType({
  name: 'partita',
  title: 'Partita',
  type: 'document',
  fields: [
    defineField({
      name: 'data',
      title: 'Data e ora',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'avversario', title: 'Avversario', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'dove',
      title: 'Casa / Trasferta',
      type: 'string',
      options: {
        list: [
          { title: 'Casa', value: 'casa' },
          { title: 'Trasferta', value: 'trasferta' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'competizione',
      title: 'Competizione',
      type: 'string',
      initialValue: 'Serie A3',
    }),
    defineField({ name: 'giornata', title: 'Giornata', type: 'string' }),
    defineField({ name: 'luogo', title: 'Palazzetto / luogo', type: 'string' }),
    defineField({
      name: 'giocata',
      title: 'Partita giocata',
      type: 'boolean',
      description: 'Attiva quando inserisci il risultato.',
      initialValue: false,
    }),
    defineField({
      name: 'setCasa',
      title: 'Set squadra di casa',
      type: 'number',
      hidden: ({ document }) => !document?.giocata,
      validation: (r) => r.min(0).max(3),
    }),
    defineField({
      name: 'setTrasferta',
      title: 'Set squadra ospite',
      type: 'number',
      hidden: ({ document }) => !document?.giocata,
      validation: (r) => r.min(0).max(3),
    }),
    defineField({
      name: 'parziali',
      title: 'Parziali',
      type: 'string',
      hidden: ({ document }) => !document?.giocata,
      description: 'Es. 25-20, 23-25, 25-19, 25-22',
    }),
    defineField({ name: 'reportUrl', title: 'Link report ufficiale (Legavolley)', type: 'url' }),
  ],
  orderings: [
    { title: 'Data (prossime prima)', name: 'dataAsc', by: [{ field: 'data', direction: 'asc' }] },
    { title: 'Data (recenti prima)', name: 'dataDesc', by: [{ field: 'data', direction: 'desc' }] },
  ],
  preview: {
    select: { avversario: 'avversario', dove: 'dove', data: 'data', giocata: 'giocata', sc: 'setCasa', st: 'setTrasferta' },
    prepare: ({ avversario, dove, data, giocata, sc, st }) => {
      const casa = dove === 'casa';
      const label = casa ? `Corigliano – ${avversario}` : `${avversario} – Corigliano`;
      const risultato = giocata && sc != null && st != null ? `  ${sc}-${st}` : '';
      return {
        title: label + risultato,
        subtitle: data ? new Date(data).toLocaleString('it-IT') : 'Data da definire',
      };
    },
  },
});
