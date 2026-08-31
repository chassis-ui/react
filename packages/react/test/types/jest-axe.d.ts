// `jest-axe` ships no types of its own. `@types/jest-axe` (DefinitelyTyped) would normally cover
// it, but that package depends on `@types/jest`, whose global `expect`/`describe`/etc.
// declarations conflict with vitest's own (see `vitest/globals.d.ts`) and silently degrade every
// matcher's type to Jest's, not vitest's. This local ambient module covers the actual API surface
// used across the suite (`axe`, `toHaveNoViolations`) without pulling `@types/jest` in.
//
// No top-level import/export here (see `vitest-matchers.d.ts` for that half) — that's what makes
// this a fresh ambient module declaration rather than an augmentation of an existing one.
declare module 'jest-axe' {
  export interface AxeResults {
    violations: unknown[]
  }

  export type JestAxe = (
    html: Element | string,
    options?: Record<string, unknown>
  ) => Promise<AxeResults>

  export const axe: JestAxe

  export const toHaveNoViolations: {
    toHaveNoViolations(results?: Partial<AxeResults>): { pass: boolean; message: () => string }
  }
}
