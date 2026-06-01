/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Externaliza pacotes pesados de servidor para não quebrarem o chunk splitting
  // do webpack. O route run-weekly-scan importa uma cadeia pesada que corrompe
  // o vendor-chunks/next.js compartilhado quando bundlada pelo webpack.
  experimental: {
    serverComponentsExternalPackages: [
      'better-sqlite3',
      'drizzle-orm',
      'openai',
      '@langchain/openai',
      '@langchain/core',
      'pdfkit',
    ],
  },
}

module.exports = nextConfig


