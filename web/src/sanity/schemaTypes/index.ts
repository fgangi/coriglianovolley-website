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
import { squadraAvversaria } from './squadraAvversaria';

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
  squadraAvversaria,
  // Oggetti riutilizzabili
  blockContent,
  posizioneAnteprima,
];
