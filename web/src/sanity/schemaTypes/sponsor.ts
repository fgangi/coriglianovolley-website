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
          { title: 'Gold', value: 'gold' },
          { title: 'Silver', value: 'silver' },
          { title: 'Partner', value: 'partner' },
        ],
        layout: 'radio',
      },
      initialValue: 'partner',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'livello', media: 'logo' },
  },
});
