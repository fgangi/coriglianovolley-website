// Tag template per evidenziare le query GROQ (nessuna dipendenza esterna).
const groq = String.raw;

export const settingsQuery = groq`*[_type == "siteSettings"][0]{
  nomeSquadra, stagione, logo, fotoSquadra, storia, bigliettiUrl, newsletterUrl, direttaUrl, email, telefono, telefoni, indirizzo, mappaPosizione, social,
  loghiLega,
  prossimaPartita->{data, avversario, dove, competizione, luogo, giornata}
}`;

export const newsListQuery = groq`*[_type == "news" && settore == $settore] | order(data desc)[0...$limit]{
  _id, titolo, "slug": slug.current, data, settore, estratto, copertina, inEvidenza
}`;

export const newsInEvidenzaQuery = groq`*[_type == "news" && inEvidenza == true] | order(data desc)[0...3]{
  _id, titolo, "slug": slug.current, data, settore, estratto, copertina
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

export const sponsorQuery = groq`*[_type == "sponsor"] | order(livello asc){
  _id, nome, logo, url, livello
}`;

export const albumListQuery = groq`*[_type == "galleryAlbum"] | order(data desc){
  _id, titolo, "slug": slug.current, data, copertina, "conteggio": count(foto)
}`;

export const giovaniliQuery = groq`*[_type == "squadraGiovanile"] | order(ordine asc, nome asc){
  _id, nome, campionato, foto, descrizione
}`;
