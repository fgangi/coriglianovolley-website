import { defineType, defineArrayMember } from 'sanity';

/** Testo ricco riutilizzabile (corpo delle notizie, descrizioni lunghe). */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Testo',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normale', value: 'normal' },
        { title: 'Titolo', value: 'h2' },
        { title: 'Sottotitolo', value: 'h3' },
        { title: 'Citazione', value: 'blockquote' },
      ],
      lists: [
        { title: 'Elenco puntato', value: 'bullet' },
        { title: 'Elenco numerato', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Grassetto', value: 'strong' },
          { title: 'Corsivo', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL' }],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Testo alternativo' }],
    }),
  ],
});
