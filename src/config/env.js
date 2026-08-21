// Scaffold di validazione env runtime.
// Da adattare quando verrà importato lo stack reale (Next.js/Vite/altro):
// - importare/chiamare validateEnv() il prima possibile all'avvio dell'app/server.
// - aggiornare REQUIRED_ENV in base alle integrazioni realmente attive.

const REQUIRED_ENV = [
  "APP_URL",
  "AUTH_SECRET",
];

/**
 * Valida che le variabili d'ambiente critiche siano presenti.
 * Lancia un errore descrittivo elencando tutte le chiavi mancanti.
 */
function validateEnv(env = process.env) {
  const missing = REQUIRED_ENV.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Variabili d'ambiente mancanti: ${missing.join(", ")}. ` +
        "Copia .env.example in .env.local e compila i valori richiesti."
    );
  }
}

module.exports = { validateEnv, REQUIRED_ENV };

if (require.main === module) {
  try {
    validateEnv();
    console.log("Env OK: tutte le variabili obbligatorie sono presenti.");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
