# Content Cockpit

Content Creator per social media manager: genera immagini/video con agente Hermes o LLM integrato e pubblica sui social.

## Requisiti
- Node.js 20+
- npm o pnpm
- account provider LLM/media/social

## Setup rapido
```bash
git clone https://github.com/Bonanton/Content-Cockpit.git
cd Content-Cockpit
cp .env.example .env.local
# compila le variabili
npm install
npm run dev
```

## Sicurezza
- Non committare mai file `.env*` reali
- Mantieni solo `.env.example` nel repository
- Ruota immediatamente le chiavi in caso di leak

## Workflow consigliato
- Branch feature: `feature/<nome>`
- Pull Request verso `main`
- CI obbligatoria (lint + test + build, se presenti)

## CI
Il workflow `.github/workflows/ci.yml` rileva automaticamente il package manager (`npm`/`pnpm`/`yarn`) dal lockfile presente ed esegue lint/test/build solo se gli script corrispondenti esistono in `package.json`. Finché non è presente un `package.json`, i job di install/lint/test/build vengono saltati.

## Audit fase 2 (dopo import codice reale)
Stato attuale: repository senza codice applicativo (nessun `package.json`/lockfile/framework). Al primo import del codice reale, allineare:
- Package manager effettivo (`npm`/`pnpm`/`yarn`) e relativo lockfile
- Framework (`Next.js`/`Vite`/altro) e script `lint`/`test`/`build`
- Validazione env runtime (vedi `src/config/env.js`, chiavi obbligatorie)
- Hardening pipeline di pubblicazione social (token solo da env, log senza dati sensibili, retry/backoff)
