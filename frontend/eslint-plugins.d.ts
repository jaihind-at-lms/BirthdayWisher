// Type declarations for ESLint plugins that ship without bundled types.

declare module 'eslint-config-prettier' {
  import type { Linter } from 'eslint'
  const config: { rules: Linter.RulesRecord }
  export default config
}

declare module 'eslint-plugin-import' {
  import type { ESLint } from 'eslint'
  const plugin: ESLint.Plugin
  export default plugin
}

declare module 'eslint-plugin-jsx-a11y' {
  import type { ESLint } from 'eslint'
  const plugin: ESLint.Plugin
  export default plugin
}

declare module 'eslint-plugin-react' {
  import type { ESLint, Linter } from 'eslint'
  const plugin: ESLint.Plugin & {
    configs: Record<string, { rules: Linter.RulesRecord }>
  }
  export default plugin
}

declare module 'eslint-plugin-react-refresh' {
  import type { ESLint } from 'eslint'
  const plugin: ESLint.Plugin
  export default plugin
}

declare module 'eslint-plugin-unused-imports' {
  import type { ESLint } from 'eslint'
  const plugin: ESLint.Plugin
  export default plugin
}
