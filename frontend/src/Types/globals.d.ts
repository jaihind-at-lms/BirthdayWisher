/// <reference types="vite/client" />

/**
 * Typed environment variables.
 * All VITE_* vars are statically replaced at build time by Vite.
 * Add new env vars here when you add them to .env
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_PORT: string
  readonly VITE_ROUTER_BASE_PATH: string
  readonly VITE_APP_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
