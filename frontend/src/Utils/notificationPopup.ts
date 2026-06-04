/**
 * Centralised toast notification helpers.
 *
 * All toasts are deduplicated — if one is already visible, a second call is
 * ignored. This prevents toast storms from rapid API errors or re-renders.
 *
 * Usage:
 *   showErrorToast('Something went wrong.')
 *   showSuccessToast('Saved successfully.')
 *   showWarningToast('Your session is about to expire.')
 */
import type { Id } from 'react-toastify'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

const TOAST_OPTIONS = {
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  autoClose: 4000,
} as const

// Tracks the active toast ID so we can check if one is already showing.
let toastId: Id = ''

/**
 * Some API errors arrive as a JSON string with a `message` field embedded
 * inside a plain string (e.g. `'{"message":"Not found"}'`).
 * This extracts the human-readable part so we don't show raw JSON to users.
 */
const extractMessage = (raw: string): string => {
  const match = /"message":\s*"([^"]+)"/.exec(raw)
  return match?.[1] ?? raw
}

/** Shows a red error toast. Errors appear top-left to distinguish from success. */
export const showErrorToast = (errorMessage: string): void => {
  if (!errorMessage || toast.isActive(toastId)) return
  toastId = toast.error(extractMessage(errorMessage), {
    ...TOAST_OPTIONS,
    position: 'top-left',
  })
}

/** Shows a green success toast. */
export const showSuccessToast = (message: string): void => {
  if (!message || toast.isActive(toastId)) return
  toastId = toast.success(message, {
    ...TOAST_OPTIONS,
    position: 'top-right',
  })
}

/** Shows an amber warning toast. */
export const showWarningToast = (message: string): void => {
  if (!message || toast.isActive(toastId)) return
  toastId = toast.warning(message, {
    ...TOAST_OPTIONS,
    position: 'top-right',
  })
}
