// Rate limiter in-memory, per singola istanza serverless.
// Sufficiente per bloccare abusi a basso volume dopo l'aggiunta dell'autenticazione.
// ATTENZIONE: su Vercel ogni istanza serverless ha la propria memoria, quindi il limite
// reale effettivo e' "N richieste per istanza attiva", non un limite globale preciso.
// Per un limite realmente condiviso tra tutte le istanze, sostituire con Upstash Ratelimit
// (https://github.com/upstash/ratelimit) collegato a Vercel KV/Redis.

const WINDOW_MS = 60_000 // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 8

const hits = new Map<string, number[]>()

export function checkRateLimit(userId: string): { allowed: boolean; retryAfterSeconds: number } {
    const now = Date.now()
    const windowStart = now - WINDOW_MS
    const timestamps = (hits.get(userId) ?? []).filter((t) => t > windowStart)

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
        const retryAfterMs = timestamps[0] + WINDOW_MS - now
        hits.set(userId, timestamps)
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) }
  }

  timestamps.push(now)
    hits.set(userId, timestamps)
    return { allowed: true, retryAfterSeconds: 0 }
}
