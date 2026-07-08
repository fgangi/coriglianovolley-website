import { defineType, defineField } from 'sanity';

/** Membro dello staff tecnico o dirigenziale. */
export const staff = defineType({
  name: 'staff',
  title: 'Staff',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome e cognome', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'ruolo', title: 'Ruolo', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'area',
      title: 'Area',
      type: 'string',
      options: {
        list: [
          { title: 'Staff tecnico', value: 'tecnico' },
          { title: 'Dirigenza', value: 'dirigenza' },
          { title: 'Staff medico', value: 'medico' },
        ],
        layout: 'radio',
      },
      initialValue: 'tecnico',
    }),
    defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'ordine', title: 'Ordine di visualizzazione', type: 'number' }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'ruolo', media: 'foto' },
  },
});
