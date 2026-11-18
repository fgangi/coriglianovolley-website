import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Evento organizzato dalla società o a cui ha partecipato: tornei, beach
 * volley, feste, presentazioni. Sul sito ha una scheda nell'elenco /eventi/ e
 * una pagina sua. Solo titolo, date, tipo e copertina sono obbligatori: ogni
 * altro blocco della pagina compare quando il campo è compilato.
 */
export const evento = defineType({
  name: 'evento',
  title: 'Evento',
  type: 'document',
  groups: [
    { name: 'base', title: 'Base', default: true },
    { name: 'contenuto', title: 'Contenuto' },
    { name: 'media', title: 'Foto e video' },
    { name: 'collegamenti', title: 'Collegamenti' },
  ],
  fields: [
    defineField({ name: 'titolo', title: 'Titolo', type: 'string', group: 'base', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (indirizzo pagina)',
      type: 'slug',
      group: 'base',
      options: { source: 'titolo', maxLength: 96 },
      description: 'Per eventi che si ripetono aggiungere l\'anno, es. "trofeo-codex-2026".',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'edizione', title: 'Edizione', type: 'string', group: 'base', description: 'Es. "4ª edizione". Facoltativo.' }),
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      group: 'base',
      options: {
        list: [
          { title: 'Organizzato da noi', value: 'organizzato' },
          { title: 'Partecipazione', value: 'partecipazione' },
        ],
        layout: 'radio',
      },
      initialValue: 'organizzato',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      group: 'base',
      options: {
        list: ['Torneo', 'Beach volley', 'Festa', 'Presentazione', 'Camp', 'Iniziativa sociale', 'Altro'],
      },
    }),
    defineField({ name: 'dataInizio', title: 'Data (primo giorno)', type: 'date', group: 'base', validation: (r) => r.required() }),
    defineField({
      name: 'dataFine',
      title: 'Ultimo giorno',
      type: 'date',
      group: 'base',
      description: 'Solo per eventi su più giorni.',
      validation: (r) => r.custom((fine, ctx: any) =>
        !fine || !ctx.document?.dataInizio || fine >= ctx.document.dataInizio ? true : 'Deve essere dopo il primo giorno'),
    }),
    defineField({ name: 'orario', title: 'Orario', type: 'string', group: 'base', description: 'Testo libero, es. "dalle 16:00". Facoltativo.' }),
    defineField({ name: 'luogo', title: 'Luogo', type: 'string', group: 'base', description: 'Es. "Pala Brillia, Corigliano-Rossano (CS)". Diventa un link a Google Maps.' }),
    defineField({ name: 'copertina', title: 'Foto di anteprima', type: 'image', group: 'base', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({
      name: 'posizioneAnteprima',
      title: 'Inquadratura dell\'anteprima',
      type: 'posizioneAnteprima',
      group: 'base',
      description: 'Cosa si vede della foto nella scheda dell\'elenco. Nella pagina dell\'evento la foto resta intera.',
    }),
    defineField({
      name: 'estratto',
      title: 'Riassunto',
      type: 'text',
      rows: 3,
      group: 'base',
      description: 'Una o due frasi per la scheda dell\'elenco e per le anteprime su Google e sui social.',
    }),

    defineField({ name: 'descrizione', title: 'Descrizione', type: 'blockContent', group: 'contenuto' }),
    defineField({ name: 'organizzatore', title: 'Organizzato da', type: 'string', group: 'contenuto' }),
    defineField({ name: 'collaborazione', title: 'In collaborazione con', type: 'string', group: 'contenuto' }),
    defineField({ name: 'ingresso', title: 'Ingresso', type: 'string', group: 'contenuto', description: 'Es. "Libero", "5 €".' }),
    defineField({
      name: 'numeri',
      title: 'In numeri',
      type: 'array',
      group: 'contenuto',
      description: 'Es. valore "4", descrizione "squadre di Serie A".',
      of: [defineArrayMember({
        type: 'object',
        name: 'numero',
        fields: [
          defineField({ name: 'valore', title: 'Valore', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'etichetta', title: 'Descrizione', type: 'string', validation: (r) => r.required() }),
        ],
        preview: { select: { title: 'valore', subtitle: 'etichetta' } },
      })],
    }),
    defineField({
      name: 'programma',
      title: 'Programma',
      type: 'array',
      group: 'contenuto',
      description: 'Se l\'evento è collegato a un torneo e questo elenco è vuoto, il programma si ricava dalle partite.',
      of: [defineArrayMember({
        type: 'object',
        name: 'momento',
        fields: [
          defineField({ name: 'giorno', title: 'Giorno', type: 'date', validation: (r) => r.required() }),
          defineField({ name: 'ora', title: 'Ora', type: 'string', description: 'Es. "16:00"' }),
          defineField({ name: 'attivita', title: 'Cosa', type: 'string', validation: (r) => r.required() }),
        ],
        preview: { select: { title: 'attivita', giorno: 'giorno', ora: 'ora' },
          prepare: ({ title, giorno, ora }) => ({ title, subtitle: [giorno, ora].filter(Boolean).join(' · ') }) },
      })],
    }),

    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'array',
      group: 'media',
      options: { layout: 'grid' },
      of: [defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [defineField({ name: 'didascalia', title: 'Didascalia', type: 'string' })],
      })],
    }),
    defineField({
      name: 'video',
      title: 'Video YouTube',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'url', validation: (r) => r.uri({ scheme: ['https'] }) })],
    }),

    defineField({
      name: 'torneo',
      title: 'Torneo',
      type: 'reference',
      group: 'collegamenti',
      to: [{ type: 'torneo' }],
      description: 'Per i tornei: nella pagina compare il tabellone con i risultati.',
    }),
    defineField({
      name: 'news',
      title: 'News collegate',
      type: 'array',
      group: 'collegamenti',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'news' }] })],
    }),
    defineField({
      name: 'link',
      title: 'Articoli e link esterni',
      type: 'array',
      group: 'collegamenti',
      description: 'Giornali, TV, Lega, altri siti.',
      of: [defineArrayMember({
        type: 'object',
        name: 'linkEsterno',
        fields: [
          defineField({ name: 'titolo', title: 'Titolo', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'fonte', title: 'Testata / sito', type: 'string' }),
          defineField({ name: 'data', title: 'Data', type: 'date' }),
          defineField({ name: 'url', title: 'Link', type: 'url', validation: (r) => r.required() }),
        ],
        preview: { select: { title: 'titolo', subtitle: 'fonte' } },
      })],
    }),
  ],
  orderings: [
    { title: 'Più recenti', name: 'dataDesc', by: [{ field: 'dataInizio', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titolo', tipo: 'tipo', data: 'dataInizio', media: 'copertina' },
    prepare: ({ title, tipo, data, media }) => ({
      title,
      subtitle: `${tipo === 'partecipazione' ? 'Partecipazione' : 'Organizzato'}${data ? ' · ' + new Date(data).toLocaleDateString('it-IT') : ''}`,
      media,
    }),
  },
});
