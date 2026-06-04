/**
 * String manipulation utilities.
 */

/** Capitalises the first character and lowercases the rest. Returns `''` for falsy input. */
export const capitalizeFirstLetter = (string: string | undefined): string => {
  if (string)
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  return ''
}

/** Replaces the first underscore with a space. Returns `''` for falsy input. */
export const removeUnderScore = (string: string | undefined): string => {
  if (string) return string.replace('_', ' ')
  return ''
}

/** Lowercases the string. Returns `''` for falsy input. */
export const toLowerCase = (string: string | undefined): string => {
  if (string) return string.toLowerCase()
  return ''
}

/** Returns the last path segment of a URL or file path. Returns `''` for falsy input. */
export const urlLastSegments = (string: string | undefined): string => {
  if (string) {
    const segments = string.split('/')
    return segments[segments.length - 1] ?? ''
  }
  return ''
}

/** Returns true if the string is non-empty and not purely whitespace. */
export const isNotEmptySpace = (value: string | undefined): boolean =>
  !!value && !/^\s+$/.test(value)

/** Prepends `https://` if the URL has no protocol. */
export const ensureHTTPS = (url: string): string => {
  if (!/^https?:\/\//i.exec(url)) return `https://${url}`
  return url
}

/**
 * Wraps bare URLs in the text with `<a>` tags.
 *
 * ⚠️ Security: only pass trusted content to this function.
 * Never render the output via `dangerouslySetInnerHTML` with raw user input —
 * it opens the door to XSS. Use `createMarkup` only after sanitising.
 */
export const parseAndReplaceLinks = (text: string): string =>
  text.replace(
    /(https?:\/\/[^\s]+)/g,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  )

/**
 * Wraps an HTML string for use with React's `dangerouslySetInnerHTML`.
 *
 * ⚠️ Security: the caller is responsible for sanitising `html` before passing
 * it here. Rendering unsanitised user input will cause XSS vulnerabilities.
 *
 * @example
 *   <div dangerouslySetInnerHTML={createMarkup(sanitisedHtml)} />
 */
export const createMarkup = (html: string): { __html: string } => ({
  __html: html,
})
