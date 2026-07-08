# Corigliano Volley — Sito ufficiale

Sito ufficiale della squadra di pallavolo di Corigliano (Serie A3 maschile).
Costruito per essere **veloce, sicuro e a bassa manutenzione**: le pagine sono statiche,
mentre i contenuti che cambiano (news, risultati, classifica, roster…) si aggiornano
da un **pannello web** senza toccare il codice.

## Architettura

- **[Astro](https://astro.build)** — genera il sito in pagine statiche (frontend).
- **[Sanity](https://www.sanity.io)** — CMS headless: il pannello redazione è integrato su `/admin`.
- **Hosting** — pensato per Cloudflare Pages (build statica + CDN).

```
web/
├─ src/
│  ├─ pages/            Pagine del sito (Home, Squadra, Partite, News, ...)
│  ├─ components/       Header, Footer, schede news/partite/giocatori
│  ├─ layouts/          Layout di base
│  ├─ lib/              Client Sanity, query GROQ, helper
│  └─ sanity/schemaTypes/   Definizione dei contenuti (i "moduli" della redazione)
├─ sanity.config.ts     Configurazione del pannello /admin
└─ astro.config.mjs
```

## Sviluppo in locale

Requisiti: **Node.js 20+**.

```bash
cd web
npm install
npm run dev        # sito su http://localhost:4321  · pannello su /admin
```

Altri comandi:

```bash
npm run build      # genera il sito statico in web/dist
npm run preview    # anteprima della build
npx astro dev stop # ferma il dev server in background
```

### Variabili d'ambiente

Il collegamento al CMS avviene tramite `web/.env` (non versionato). Copia l'esempio e
inserisci i valori del progetto Sanity:

```bash
cp web/.env.example web/.env
```

```
PUBLIC_SANITY_PROJECT_ID=<project-id>
PUBLIC_SANITY_DATASET=production
```

## Aggiornare i contenuti (redazione)

1. Apri **`/admin`** e accedi.
2. Compila i moduli: **Notizie · Partite · Classifica · Roster · Staff · Settore giovanile · Sponsor · Gallery** e **⚙️ Impostazioni sito** (nome, social, contatti, biglietteria).
3. Salva: in produzione il sito si rigenera e va online in pochi minuti.

**Classifica e risultati** si inseriscono a mano (tabella o screenshot da legavolley.it,
con link ufficiale) — la Lega non offre un widget pubblico da incorporare.

## Deploy

Pensato per **Cloudflare Pages**. Build di produzione: cartella radice `web/`, comando
`npm run build`, output `dist`. Impostare le variabili `PUBLIC_SANITY_PROJECT_ID` e
`PUBLIC_SANITY_DATASET`, e aggiungere l'origine del sito di produzione tra i **CORS origins**
del progetto Sanity.
