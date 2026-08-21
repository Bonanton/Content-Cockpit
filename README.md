# Content Cockpit

Content creator per social media manager: genera contenuti e immagini con l'agente Hermes (Vercel AI Gateway + fal.ai) e li prepara per la pubblicazione sui social.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- - **UI**: Tailwind CSS 4, shadcn/ui (stile `base-nova`), lucide-react
  - - **Auth**: better-auth (email/password)
    - - **Database**: PostgreSQL via Drizzle ORM
      - - **AI**: Vercel AI Gateway (testo) + fal.ai `flux/schnell` (immagini)
        - - **Package manager**: **pnpm** (obbligatorio, il repo ha `pnpm-lock.yaml`, non usare `npm install`)
         
          - ## Setup locale
         
          - ```bash
            git clone https://github.com/Bonanton/Content-Cockpit.git
            cd Content-Cockpit
            cp .env.example .env.local
            # compila le variabili in .env.local (vedi sotto)
            pnpm install
            pnpm db:generate
            pnpm db:push
            pnpm dev
            ```

            ## Variabili d'ambiente

            Vedi `.env.example`. Riepilogo:

            | Variabile | Obbligatoria | Note |
            |---|---|---|
            | `DATABASE_URL` | Si | Postgres (Vercel Postgres, Neon, Supabase, ...) |
            | `AI_GATEWAY_API_KEY` | Si | Genera i testi (agente Hermes) |
            | `FAL_KEY` | Si | Genera le immagini |
            | `BETTER_AUTH_URL` | No | Dedotta automaticamente in produzione da `VERCEL_URL` |

            Le stesse variabili vanno impostate anche in Vercel, Project Settings, Environment Variables, altrimenti il deploy in produzione non genera contenuti ne' fa login.

            ## Database

            Lo schema e' in `lib/db/schema.ts`. Genera la prima migrazione con `pnpm db:generate` (non serve un database reale collegato per generarla, solo per applicarla).

            - `pnpm db:generate` - rigenera le migrazioni dopo una modifica allo schema
            - - `pnpm db:push` - applica lo schema direttamente al database (comodo in sviluppo)
              - - `pnpm db:migrate` - applica le migrazioni versionate (da preferire in produzione)
               
                - ## Sicurezza
               
                - Le API route (`/api/generate-content`, `/api/generate-image`) richiedono una sessione autenticata (better-auth) e applicano un rate limit per utente (`lib/rate-limit.ts`, 8 richieste/minuto per istanza). Il rate limit e' in-memory: per un limite realmente condiviso tra tutte le istanze serverless su Vercel, sostituirlo con Upstash Ratelimit (https://github.com/upstash/ratelimit).
               
                - Non committare mai file `.env*` con chiavi reali: sono gia' esclusi da `.gitignore`. Ruota immediatamente le chiavi in caso di perdita accidentale.
               
                - ## Flusso di lavoro consigliato
               
                - 1. Branch per feature: `feature/<nome>`
                  2. 2. Pull Request verso `main`
                     3. 3. CI obbligatoria (lint + typecheck + build), vedi `.github/workflows/ci.yml`
                        4. 4. Merge dopo review
                          
                           5. ## Stato dell'audit fase 2
                          
                           6. - [x] Codice v0 importato su `main`
                              - [ ] - [x] Autenticazione + rate limit sulle API route
                              - [ ] - [x] `.env.example` allineato alle variabili realmente usate nel codice
                              - [ ] - [x] `next.config.mjs`: rimosso `ignoreBuildErrors` dopo aver verificato che il typecheck e' pulito
                              - [ ] - [x] CI (lint + typecheck + build) su ogni PR verso `main`
                              - [ ] - [ ] Migrazione Drizzle iniziale generata (`pnpm db:generate`) e committata
                              - [ ] - [ ] Database di produzione collegato (`DATABASE_URL` reale su Vercel), da fare manualmente
                              - [ ] - [ ] Chiavi reali (`AI_GATEWAY_API_KEY`, `FAL_KEY`) impostate su Vercel, da fare manualmente
                              - [ ] - [ ] Test automatici (nessuno presente ancora)
                              - [ ] 
