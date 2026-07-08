import { defineType, defineField } from 'sanity';

/** Album fotografico. */
export const galleryAlbum = defineType({
  name: 'galleryAlbum',
  title: 'Album gallery',
  type: 'document',
  fields: [
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titolo', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'data', title: 'Data', type: 'date', initialValue: () => new Date().toISOString().slice(0, 10) }),
    defineField({ name: 'copertina', title: 'Copertina', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Didascalia' }],
        },
      ],
      options: { layout: 'grid' },
    }),
  ],
  orderings: [{ title: 'Più recenti', name: 'dataDesc', by: [{ field: 'data', direction: 'desc' }] }],
  preview: {
    select: { title: 'titolo', data: 'data', media: 'copertina' },
    prepare: ({ title, data, media }) => ({
      title,
      subtitle: data ? new Date(data).toLocaleDateString('it-IT') : '',
      media,
    }),
  },
});
