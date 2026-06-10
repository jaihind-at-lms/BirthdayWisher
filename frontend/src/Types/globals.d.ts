/// <reference types="vite/client" />

declare module 'bootstrap' {
  export class Modal {
    constructor(element: Element, options?: Partial<Modal.Options>)
    static getInstance(element: Element): Modal | null
    static getOrCreateInstance(element: Element, options?: Partial<Modal.Options>): Modal
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Modal {
    interface Options {
      backdrop: boolean | 'static'
      keyboard: boolean
      focus: boolean
    }
  }

  export class Offcanvas {
    constructor(element: Element, options?: Partial<Offcanvas.Options>)
    static getInstance(element: Element): Offcanvas | null
    static getOrCreateInstance(element: Element, options?: Partial<Offcanvas.Options>): Offcanvas
    show(): void
    hide(): void
    toggle(): void
    dispose(): void
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Offcanvas {
    interface Options {
      backdrop: boolean | 'static'
      keyboard: boolean
      scroll: boolean
    }
  }
}

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
