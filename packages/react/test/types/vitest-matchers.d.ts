// Augments vitest's `Assertion` with `toHaveNoViolations` (registered at runtime by
// `test/axeMatchers.ts` via `expect.extend`). The `import 'vitest'` is required — it's what makes
// this a module, so `declare module 'vitest'` below merges into the real module's types instead
// of replacing them (matches @testing-library/jest-dom's own `types/vitest.d.ts`).
import 'vitest'

declare module 'vitest' {
  // `T` must match @testing-library/jest-dom's own `types/vitest.d.ts` augmentation of the same
  // interface exactly (TS requires identical type parameters across all merged declarations),
  // even though this particular matcher doesn't use it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  interface Assertion<T = any> {
    toHaveNoViolations(): void
  }
}
