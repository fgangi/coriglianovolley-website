import { defineType, defineField } from 'sanity';
import { DESCRIZIONE_LOGO, validaLogo } from '../regoleLogo';

/**
 * Squadra del girone, con il suo stemma.
 * Si inserisce una volta sola e si richiama in ogni partita: evita di
 * riscrivere il nome a mano (e di scriverlo in due modi diversi).
 */
export const squadraAvversaria = defineType({
  name: 'squadraAvversaria',
  title: 'Squadre del girone',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'logo',
      title: 'Stemma',
      type: 'image',
      description: DESCRIZIONE_LOGO,
      validation: validaLogo,
    }),
    defineField({ name: 'citta', title: 'Città', type: 'string' }),
  ],
  preview: { select: { title: 'nome', subtitle: 'citta', media: 'logo' } },
});
