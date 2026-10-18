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

**Classifica**: a ogni pubblicazione il sito la legge da legavolley.it
(`web/src/lib/classificaLega.ts`). Se la lettura non riesce, per esempio perché la Lega ha
cambiato la pagina, usa quella inserita a mano nel pannello (tabella o screenshot) e lo scrive
nel registro della pubblicazione su Cloudflare: cercare `[classifica]`. Nel pannello,
"Usa solo la classifica inserita qui" forza sempre quella manuale.
**Risultati**: si inseriscono a mano nelle partite.

## Deploy

Pensato per **Cloudflare Pages**. Build di produzione: cartella radice `web/`, comando
`npm run build`, output `dist`. Impostare le variabili `PUBLIC_SANITY_PROJECT_ID` e
`PUBLIC_SANITY_DATASET`, e aggiungere l'origine del sito di produzione tra i **CORS origins**
del progetto Sanity.

### Aggiornamento settimanale della classifica

La GitHub Action `.github/workflows/aggiorna-classifica.yml` ripubblica il sito ogni
domenica sera (mezzanotte in estate, 23:00 in inverno), a giornata conclusa. Per attivarla:

1. Cloudflare → progetto Pages → **Settings → Builds → Deploy hooks** → crea un hook
   (ramo `main`) e copia l'URL.
2. GitHub → repository → **Settings → Secrets and variables → Actions** → nuovo segreto
   `CLOUDFLARE_DEPLOY_HOOK` con quell'URL.
3. Per provarla subito: scheda **Actions → Aggiorna classifica → Run workflow**.
