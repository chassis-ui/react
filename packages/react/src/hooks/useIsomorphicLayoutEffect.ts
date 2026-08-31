import { useEffect, useLayoutEffect } from 'react'

// `useLayoutEffect` logs a console warning ("does nothing on the server") whenever it's called
// during SSR, even though no effect — layout or otherwise — ever actually runs server-side;
// React only cares that the hook itself was invoked under `renderToString`/
// `renderToPipeableStream`. Swapping to `useEffect` in that environment silences the warning with
// no behavior change, since neither hook runs server-side anyway — this only picks which one
// no-ops there.
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
