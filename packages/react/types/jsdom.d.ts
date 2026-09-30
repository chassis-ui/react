// The part of jsdom's API `test/ssr/render.spec.tsx` uses to parse server HTML without installing
// a global DOM. jsdom ships no types, and `@types/jsdom` would be a dependency for one line.
declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string)
    readonly window: Window & typeof globalThis
  }
}
