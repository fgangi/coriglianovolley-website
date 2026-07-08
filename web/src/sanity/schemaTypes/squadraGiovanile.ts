import { defineType, defineField } from 'sanity';

/** Squadra del settore giovanile (es. Under 19, Under 17...). */
export const squadraGiovanile = defineType({
  name: 'squadraGiovanile',
  title: 'Squadra giovanile',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome / categoria', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'campionato', title: 'Campionato', type: 'string' }),
    defineField({ name: 'foto', title: 'Foto squadra', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'descrizione', title: 'Descrizione', type: 'text', rows: 4 }),
    defineField({ name: 'ordine', title: 'Ordine di visualizzazione', type: 'number' }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'campionato', media: 'foto' },
  },
});
