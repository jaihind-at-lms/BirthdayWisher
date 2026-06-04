/**
 * Browser storage utilities.
 *
 * Auth tokens are stored in sessionStorage (cleared on tab close).
 * Use localStorage only for non-sensitive, long-lived preferences.
 */

// ─── Session storage (auth tokens, sensitive data) ────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const setSessionStorage = <TValue>(key: string, value: TValue): void => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const getSessionStorage = <TReturn>(
  key: string
): TReturn | undefined => {
  if (!key) return undefined
  const data = sessionStorage.getItem(key)
  if (!data) return undefined
  return JSON.parse(data) as TReturn
}

export const removeSessionStorage = (key: string): void => {
  sessionStorage.removeItem(key)
}

export const clearSessionStorage = (): void => {
  sessionStorage.clear()
}

// ─── Local storage (non-sensitive preferences) ────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const setLocalStorage = <TValue>(key: string, value: TValue): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const getLocalStorage = <TReturn>(key: string): TReturn | undefined => {
  if (!key) return undefined
  const data = localStorage.getItem(key)
  if (!data) return undefined
  return JSON.parse(data) as TReturn
}

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key)
}

export const clearLocalStorage = (): void => {
  localStorage.clear()
}
