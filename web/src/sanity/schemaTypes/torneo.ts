import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Torneo breve (es. triangolare o quadrangolare precampionato), separato dal
 * campionato: le sue partite non finiscono nel calendario né nei risultati di
 * Serie A3, e possono non coinvolgere il Corigliano.
 *
 * Sul sito compare in cima alla pagina Partite solo con "Mostra sul sito"
 * attivo. Le squadre delle finali non vanno inserite: le ricava il sito dai
 * risultati delle semifinali (vincenti in finale, perdenti al 3°/4° posto).
 */
const FASI = [
  { title: 'Semifinale 1', value: 'sf1' },
  { title: 'Semifinale 2', value: 'sf2' },
  { title: 'Finale 3°/4° posto', value: 'f34' },
  { title: 'Finale', value: 'f12' },
];

const lato = (nome: string, titolo: string) => [
  defineField({
    name: nome,
    title: titolo,
    type: 'reference',
    to: [{ type: 'squadraAvversaria' }],
    description: 'Dall\'elenco delle squadre (porta lo stemma). Per il Corigliano o per una squadra non in elenco usa il nome qui sotto.',
  }),
  defineField({
    name: `${nome}Nome`,
    title: `${titolo} (nome)`,
    type: 'string',
    description: 'Solo per il Corigliano ("Corigliano Volley") o per squadre non in elenco. Per le squadre del girone lascialo vuoto: vale il nome salvato nelle Squadre del girone.',
  }),
];

export const torneo = defineType({
  name: 'torneo',
  title: 'Torneo',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome del torneo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'edizione', title: 'Edizione', type: 'string', description: 'Es. "4ª edizione".' }),
    defineField({
      name: 'attivo',
      title: 'Mostra sul sito',
      type: 'boolean',
      initialValue: true,
      description: 'Spegnilo a torneo concluso: la sezione sparisce dal sito ma resta qui.',
    }),
    defineField({
      name: 'diretta',
      title: 'Partite trasmesse in diretta',
      type: 'boolean',
      initialValue: false,
      description: 'Se attivo, nei giorni del torneo la striscia della diretta (home e pagina Partite) si accende anche per queste partite.',
    }),
    defineField({ name: 'luogo', title: 'Palazzetto', type: 'string' }),
    defineField({ name: 'nota', title: 'Nota', type: 'string', description: 'Es. "Ingresso libero".' }),
    defineField({ name: 'articolo', title: 'Link all\'articolo o al volantino', type: 'url' }),
    defineField({
      name: 'partite',
      title: 'Partite',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'partitaTorneo',
          fields: [
            defineField({ name: 'fase', title: 'Fase', type: 'string', options: { list: FASI, layout: 'radio' }, validation: (r) => r.required() }),
            defineField({ name: 'data', title: 'Data e ora', type: 'datetime' }),
            ...lato('casa', 'Squadra 1'),
            ...lato('ospite', 'Squadra 2'),
            defineField({ name: 'setCasa', title: 'Set squadra 1', type: 'number', validation: (r) => r.min(0).max(5) }),
            defineField({ name: 'setOspite', title: 'Set squadra 2', type: 'number', validation: (r) => r.min(0).max(5) }),
            defineField({ name: 'parziali', title: 'Parziali', type: 'string', description: 'Es. 25-20, 23-25, 25-18, 25-22' }),
          ],
          preview: {
            select: { fase: 'fase', a: 'casa.nome', an: 'casaNome', b: 'ospite.nome', bn: 'ospiteNome', sa: 'setCasa', sb: 'setOspite' },
            prepare: ({ fase, a, an, b, bn, sa, sb }) => ({
              title: FASI.find((f) => f.value === fase)?.title ?? 'Partita',
              subtitle: `${an || a || 'da definire'} - ${bn || b || 'da definire'}${sa != null && sb != null ? `  ${sa}-${sb}` : ''}`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'nome', subtitle: 'edizione', attivo: 'attivo' },
    prepare: ({ title, subtitle, attivo }) => ({ title, subtitle: `${subtitle ?? ''}${attivo ? ' · sul sito' : ''}` }) },
});
