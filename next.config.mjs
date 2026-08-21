/** @type {import('next').NextConfig} */
const nextConfig = {
    // ignoreBuildErrors era true di default (impostazione da prototipo v0).
    // Rimosso dopo aver verificato che il progetto compila senza errori TypeScript reali
    // (mancava solo @types/pg, ora aggiunto). Da qui in poi un errore di tipo blocca il build,
    // com'e' giusto che sia in produzione.
    images: {
          unoptimized: true,
    },
}

export default nextConfig
