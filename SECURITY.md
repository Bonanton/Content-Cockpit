# Security Policy

## Segnalare una vulnerabilità

Non aprire una issue pubblica per vulnerabilità di sicurezza. Segnala privatamente:

- Usa [GitHub Security Advisories](https://github.com/Bonanton/Content-Cockpit/security/advisories/new) per questo repository, oppure
- Contatta i maintainer via canale privato concordato (es. email dedicata).

Includi: descrizione, passi di riproduzione, impatto stimato, eventuale PoC.

## Regole sui segreti

- Nessuna chiave API, token, password o credenziale deve essere committata nel repository.
- Usa `.env.local` (ignorato da Git) e `.env.example` come riferimento dei placeholder.
- Se un segreto viene individuato nella history di Git, va considerato compromesso.

## Rotazione chiavi in caso di leak

1. Revoca/rigenera immediatamente la chiave compromessa presso il provider.
2. Aggiorna la chiave in tutti gli ambienti (dev, staging, prod) e nei secret manager/CI.
3. Verifica i log di utilizzo del provider per attività anomale nel periodo di esposizione.
4. Se il segreto è nella history Git, valuta la riscrittura della history (`git filter-repo` / BFG) e forza il refresh dei clone locali, coordinando il team.
5. Documenta l'incidente (causa, timeline, azioni correttive).

## Versioni supportate

Progetto in fase iniziale: solo il branch `main` riceve fix di sicurezza.
