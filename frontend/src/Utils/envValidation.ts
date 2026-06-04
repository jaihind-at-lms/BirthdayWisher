/**
 * Validates required environment variables at app startup.
 * Throws early with a clear message rather than failing silently at runtime.
 */

interface EnvConfig {
  VITE_API_BASE_URL: string
  VITE_ROUTER_BASE_PATH: string
  VITE_PORT: string
}

const validateEnv = (): EnvConfig => {
  const required: (keyof EnvConfig)[] = [
    'VITE_API_BASE_URL',
    'VITE_ROUTER_BASE_PATH',
    'VITE_PORT',
  ]

  const missing = required.filter((key) => !import.meta.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Check your .env file and ensure all required variables are set.'
    )
  }

  return {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_ROUTER_BASE_PATH: import.meta.env.VITE_ROUTER_BASE_PATH,
    VITE_PORT: import.meta.env.VITE_PORT,
  }
}

export const env = validateEnv()
