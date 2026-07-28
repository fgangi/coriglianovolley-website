import { defineType, defineField } from 'sanity';

const RUOLI = [
  { title: 'Palleggiatore', value: 'palleggiatore' },
  { title: 'Opposto', value: 'opposto' },
  { title: 'Schiacciatore (banda)', value: 'schiacciatore' },
  { title: 'Centrale', value: 'centrale' },
  { title: 'Libero', value: 'libero' },
];

/** Giocatore del roster. */
export const giocatore = defineType({
  name: 'giocatore',
  title: 'Giocatore',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'cognome', title: 'Cognome', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'numero',
      title: 'Numero di maglia',
      type: 'number',
      validation: (r) => r.min(0).max(99),
    }),
    defineField({
      name: 'ruolo',
      title: 'Ruolo',
      type: 'string',
      options: { list: RUOLI, layout: 'radio' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'annoNascita',
      title: 'Anno di nascita',
      type: 'number',
      description: 'Solo l\'anno, come pubblicato dalla Lega (es. 2005).',
      validation: (r) => r.min(1950).max(new Date().getFullYear()),
    }),
    defineField({
      name: 'altezza',
      title: 'Altezza (cm)',
      type: 'number',
      validation: (r) => r.min(100).max(250),
    }),
    defineField({
      name: 'nazionalita',
      title: 'Nazionalità',
      type: 'string',
      initialValue: 'Italia',
    }),
    defineField({ name: 'bio', title: 'Nota biografica', type: 'text', rows: 4 }),
    defineField({
      name: 'ordine',
      title: 'Ordine di visualizzazione',
      type: 'number',
      description: 'Più basso = mostrato prima (opzionale).',
    }),
  ],
  orderings: [
    { title: 'Numero maglia', name: 'numeroAsc', by: [{ field: 'numero', direction: 'asc' }] },
  ],
  preview: {
    select: { nome: 'nome', cognome: 'cognome', numero: 'numero', media: 'foto' },
    prepare: ({ nome, cognome, numero, media }) => ({
      title: `${numero != null ? '#' + numero + ' ' : ''}${nome ?? ''} ${cognome ?? ''}`.trim(),
      media,
    }),
  },
});
