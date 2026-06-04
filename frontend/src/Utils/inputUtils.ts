/**
 * Input handling utilities for form fields.
 */
import type { KeyboardEvent } from 'react'

const REGEX_ONLY_NUMBERS = /^[0-9\b]+$/

// Keys that should always be allowed regardless of input restrictions.
const ALLOWED_KEYS = [
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'Enter',
  'Tab',
]

/**
 * `onKeyDown` handler that restricts a text input to digits only.
 * Attach to numeric fields where `type="number"` is undesirable
 * (e.g. phone numbers, OTP fields).
 *
 * @example
 *   <input onKeyDown={handleKeyDownOnlyNumbers} />
 */
export const handleKeyDownOnlyNumbers = (
  event: KeyboardEvent<HTMLInputElement>
): void => {
  if (REGEX_ONLY_NUMBERS.test(event.key) || ALLOWED_KEYS.includes(event.key))
    return
  event.preventDefault()
}

/**
 * Generates a random alphanumeric string of the given length.
 * Useful for temporary IDs, CAPTCHA seeds, or test data — not for
 * cryptographic purposes.
 *
 * @param length - Number of characters to generate. Defaults to 4.
 */
export const randomString = (length = 4): string => {
  const chars = '9876543210ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
