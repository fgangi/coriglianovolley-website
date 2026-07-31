import { defineType, defineField } from 'sanity';

/** Sponsor / partner. */
export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'url', title: 'Sito web', type: 'url' }),
    defineField({
      name: 'livello',
      title: 'Livello',
      type: 'string',
      options: {
        list: [
          { title: 'Main sponsor', value: 'main' },
          { title: 'Gold sponsor', value: 'gold' },
          { title: 'Silver sponsor', value: 'silver' },
          { title: 'Bronze sponsor', value: 'bronze' },
          { title: 'Partner', value: 'partner' },
          { title: 'Media partner', value: 'media' },
          { title: 'Ticketing partner', value: 'ticketing' },
        ],
        layout: 'radio',
      },
      initialValue: 'partner',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ordine',
      title: 'Ordine di visualizzazione',
      type: 'number',
      description: 'Più basso = mostrato prima, all\'interno del proprio livello.',
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'livello', media: 'logo' },
  },
});
