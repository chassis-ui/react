// `postcss-prefix-custom-properties` ships no type declarations of its own. It's build tooling
// (used by `.storybook/main.ts` and `tsdown.config.ts` to rewrite bare `var(--foo)` references to
// `var(--cx-foo)`), never imported from `src/`, so this ambient declaration lives outside `src/`
// and can't leak into the published `dist/index.d.ts`.
declare module 'postcss-prefix-custom-properties' {
  import type { PluginCreator } from 'postcss'

  const plugin: PluginCreator<{ prefix: string; ignore?: RegExp[] }>
  export default plugin
}
