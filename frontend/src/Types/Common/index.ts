/** Generic option shape used by dropdowns, selects, etc. */
export interface SelectOption<TValue = string> {
  id: TValue
  name: string
  disabled?: boolean
}

/** Makes specific keys of T required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/** Makes specific keys of T optional */
export type PartialFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/** Extracts the value type from an `as const` object */
export type ValueOf<T> = T[keyof T]

/** Makes all nested properties readonly recursively */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

/** Nullable wrapper */
export type Nullable<T> = T | null
