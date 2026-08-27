// Chromium/WebKit's `:focus-visible` heuristic has no interaction history to consult on the very
// first focus event of a page load, so a genuine pointer press can still paint a focus ring as if
// it came from the keyboard — most visible on whatever element happens to be the first thing a
// visitor clicks. A single capture-phase `pointerdown` listener on `document`, installed once (see
// `install` below, called for its side effect from `index.ts`), preemptively suppresses the
// outline on whatever focusable element the press is about to focus — before the browser's own
// default action grants focus and paints the ring for it — then restores it on blur. Safe to run
// on every press, not just the page's first: if the browser was already going to correctly
// withhold the ring, this suppress/restore cycle is a no-op within the same frame.
//
// Mirrors react-aria's own `@react-aria/interactions` global modality tracking (one document-level
// listener rather than one per component/instance) without switching this library's focus rings
// from chassis-css's native `:focus-visible` CSS to JS-driven state — react-aria's `isFocusVisible`
// is consumed by applying a class/attribute, which would fork focus-ring styling from the vanilla,
// non-React product chassis-css also ships. Deliberately unscoped to this library's own markup, for
// the same reason react-aria's own fix is unscoped: the browser bug isn't specific to any one
// component library, and a page generally wants one consistent focus-ring policy for every
// focusable element on it, not just the subset a component library happens to own.
const FOCUSABLE_SELECTOR = 'a[href], button, input, select, textarea, [tabindex]'

const suppressed = new WeakSet<HTMLElement>()

// Shared by the global `pointerdown` listener below and by call sites that move focus themselves
// via script (e.g. `RangeCalendar`'s hover-to-preview-a-range, which calls `element.focus()` from
// a `pointerenter` handler — outside the `pointerdown` this module otherwise listens for).
export function suppressFocusRing(el: HTMLElement): void {
  // chassis-css's `.form-input` placeholder deliberately grants its focus ring on `:focus-within`
  // as well as `:focus-visible` (see `_form.scss`), unlike the `:focus-visible`-only policy this
  // module otherwise mirrors for buttons/links/checks/etc. — a form field is meant to show its
  // ring regardless of whether the focus came from a click or the keyboard, so the very
  // first-press-of-page-load quirk this module works around isn't a bug for `.form-input` in the
  // first place: forcing its outline off here would fight, then correctly-but-uselessly restore,
  // an outline chassis-css wants visible the whole time the field is focused.
  if (el.classList.contains('form-input')) return
  // `suppressed` guards re-entrancy: a second call for the same element before it blurs (e.g. a
  // rapid re-press, or the pointer re-entering a cell) would otherwise stack a second blur
  // listener that clobbers the first restoration and leaves the ring permanently suppressed.
  if (suppressed.has(el)) return

  suppressed.add(el)
  const prevOutline = el.style.outline
  el.style.outline = 'none'
  el.addEventListener(
    'blur',
    () => {
      el.style.outline = prevOutline
      suppressed.delete(el)
    },
    { once: true }
  )
}

function handlePointerDown(event: PointerEvent) {
  const target = event.target
  if (!(target instanceof Element)) return
  const el = target.closest<HTMLElement>(FOCUSABLE_SELECTOR)
  if (!el) return
  suppressFocusRing(el)
}

let installed = false

export function install(): void {
  if (installed || typeof document === 'undefined') return
  installed = true
  document.addEventListener('pointerdown', handlePointerDown, true)
}

install()
