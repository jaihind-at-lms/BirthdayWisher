/**
 * DOM and browser interaction utilities.
 */

/** Scrolls the window back to the top. Call on route changes if needed. */
export const scrollTop = (): void => {
  window.scrollTo(0, 0)
}

/** Writes `text` to the system clipboard. Returns a promise that resolves on success. */
export const copyToClipBoard = (text: string): Promise<void> =>
  window.navigator.clipboard.writeText(text)

/**
 * Reads a Blob (e.g. a File) and resolves with its base64 data URI.
 * Useful for image previews before upload.
 */
export const fileToDataUri = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('FileReader failed to read file.'))
      }
    }
    reader.readAsDataURL(file)
  })

/**
 * Triggers a file download by creating a temporary anchor element.
 * Works for both same-origin URLs and blob URLs.
 */
export const downloadFile = (url: string, fileName: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.parentNode?.removeChild(link)
}
