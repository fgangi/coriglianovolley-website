// Tag template per evidenziare le query GROQ (nessuna dipendenza esterna).
const groq = String.raw;

export const settingsQuery = groq`*[_type == "siteSettings"][0]{
  nomeSquadra, stagione, logo, fotoSquadra, storia, bigliettiUrl, abbonamentiUrl, iscrizioni, newsletterUrl, direttaUrl, email, pec, telefono, telefoni, denominazione, codiceFipav, partitaIva, indirizzo, mappaPosizione, social,
  loghiLega,
  prossimaPartita->{data, avversario, dove, competizione, luogo, giornata}
}`;

export const newsListQuery = groq`*[_type == "news" && settore == $settore] | order(data desc)[0...$limit]{
  _id, titolo, "slug": slug.current, data, settore, estratto, copertina, posizioneAnteprima, inEvidenza
}`;

// Ultime notizie di qualunque sezione (usata in home): prima squadra e
// settore giovanile insieme, distinte a colpo d'occhio dall'etichetta sulla scheda.
export const newsUltimeQuery = groq`*[_type == "news"] | order(data desc)[0...$limit]{
  _id, titolo, "slug": slug.current, data, settore, estratto, copertina, posizioneAnteprima, inEvidenza
}`;

export const newsInEvidenzaQuery = groq`*[_type == "news" && inEvidenza == true] | order(data desc)[0...3]{
  _id, titolo, "slug": slug.current, data, settore, estratto, copertina, posizioneAnteprima
}`;

export const newsBySlugQuery = groq`*[_type == "news" && slug.current == $slug][0]{
  titolo, data, settore, estratto, copertina, corpo
}`;

export const newsSlugsQuery = groq`*[_type == "news" && defined(slug.current)]{ "slug": slug.current }`;

export const prossimePartiteQuery = groq`*[_type == "partita" && giocata != true] | order(data asc)[0...$limit]{
  _id, data, avversario, dove, competizione, giornata, luogo, direttaUrl
}`;

export const risultatiQuery = groq`*[_type == "partita" && giocata == true] | order(data desc)[0...$limit]{
  _id, data, avversario, dove, competizione, giornata, giocata, setCasa, setTrasferta, parziali, reportUrl
}`;

export const calendarioQuery = groq`*[_type == "partita"] | order(data asc){
  _id, data, avversario, dove, competizione, giornata, luogo, giocata, setCasa, setTrasferta, parziali, reportUrl, direttaUrl
}`;

export const classificaQuery = groq`*[_type == "classifica"] | order(aggiornataAl desc)[0]{
  titolo, aggiornataAl, modalita, immagine, righe, linkUfficiale
}`;

export const rosterQuery = groq`*[_type == "giocatore"] | order(ordine asc, numero asc){
  _id, nome, cognome, numero, ruolo, foto, annoNascita, altezza, nazionalita, bio
}`;

export const staffQuery = groq`*[_type == "staff"] | order(ordine asc, nome asc){
  _id, nome, ruolo, area, foto
}`;

export const sponsorQuery = groq`*[_type == "sponsor"] | order(ordine asc, nome asc){
  _id, nome, logo, url, livello, ordine
}`;

export const albumListQuery = groq`*[_type == "galleryAlbum"] | order(data desc){
  _id, titolo, "slug": slug.current, data, copertina, "conteggio": count(foto)
}`;

export const giovaniliQuery = groq`*[_type == "squadraGiovanile"] | order(ordine asc, nome asc){
  _id, nome, campionato, foto, descrizione
}`;
