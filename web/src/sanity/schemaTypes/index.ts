import { blockContent } from './blockContent';
import { posizioneAnteprima } from './posizioneAnteprima';
import { siteSettings } from './siteSettings';
import { giocatore } from './giocatore';
import { staff } from './staff';
import { news } from './news';
import { partita } from './partita';
import { classifica } from './classifica';
import { sponsor } from './sponsor';
import { galleryAlbum } from './galleryAlbum';
import { squadraGiovanile } from './squadraGiovanile';

export const schemaTypes = [
  // Documenti
  siteSettings,
  news,
  partita,
  classifica,
  giocatore,
  staff,
  sponsor,
  galleryAlbum,
  squadraGiovanile,
  // Oggetti riutilizzabili
  blockContent,
  posizioneAnteprima,
];
