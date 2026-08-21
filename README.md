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

## Audit fase 2 (dopo import codice 0v)
- Allineamento package manager (`npm`/`pnpm`)
- Allineamento stack (`Next.js`/`Vite`/altro)
- Validazione env runtime (chiavi obbligatorie)
- Hardening pipeline di pubblicazione social
