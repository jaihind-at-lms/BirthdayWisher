/**
 * Object and data manipulation utilities.
 */

/** Returns a deep clone of `data` via JSON serialisation. Only use with JSON-safe values. */
export const makeDeepCopy = <T>(data: T): T =>
  JSON.parse(JSON.stringify(data)) as T

/** Returns true if both objects serialise to the same JSON string. Order-sensitive. */
export const isSameObject = <T>(obj1: T, obj2: T): boolean =>
  JSON.stringify(obj1) === JSON.stringify(obj2)

/** Returns a shallow copy of `obj` with the specified keys omitted. */
export const removeKeysFromObject = <T extends object>(
  obj: T,
  keysToRemove?: (keyof T)[]
): Partial<T> => {
  const result: Partial<T> = {}
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (!keysToRemove?.includes(key)) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Trims all string values in a flat object in-place.
 * Non-string values pass through unchanged.
 * Use before submitting form data to strip accidental leading/trailing whitespace.
 */
export const trimFinalData = <T extends Record<string, unknown>>(
  data: T
): T => {
  const result = {} as T
  for (const key of Object.keys(data) as (keyof T)[]) {
    const value = data[key]
    result[key] = (
      typeof value === 'string' ? value.trim() : value
    ) as T[keyof T]
  }
  return result
}

/** Converts a plain object into a `FormData` instance. All values are coerced to strings. */
export const getFormData = (object: Record<string, unknown>): FormData => {
  const formData = new FormData()
  for (const [key, value] of Object.entries(object)) {
    formData.append(key, String(value))
  }
  return formData
}

/**
 * Recursively counts all keys in an object, including keys inside nested
 * objects and objects inside arrays. Useful for calculating form completeness.
 */
export const countKeys = (obj: Record<string, unknown>): number => {
  let count = Object.keys(obj).length
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'object' && item !== null) {
            count += countKeys(item as Record<string, unknown>)
          }
        }
      } else {
        count += countKeys(value as Record<string, unknown>)
      }
    }
  }
  return count
}

/**
 * Calculates what percentage of a profile's fields are filled.
 * A field is considered "filled" if its value is truthy and not -1 or 0.
 *
 * @param values - The profile object to evaluate.
 * @param totalFields - The expected total number of fields (denominator).
 * @returns A rounded integer percentage (0–100).
 */
export const calculateProfilePercentage = (
  values: Record<string, unknown>,
  totalFields: number
): number => {
  let filledFields = 0
  for (const value of Object.values(values)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'object' && item !== null) {
          filledFields += Object.values(item as Record<string, unknown>).filter(
            (v) => v !== -1 && v !== 0 && !!v
          ).length
        }
      }
    } else if (value !== -1 && value !== 0 && !!value) {
      filledFields += 1
    }
  }
  return Math.round((filledFields / totalFields) * 100)
}
