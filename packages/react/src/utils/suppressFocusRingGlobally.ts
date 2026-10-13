// A press focuses most elements by the browser's own default action, which never matches
// `:focus-visible` outside a text field, so chassis-css's ring stays off by itself. react-aria's
// `usePress` focuses its element by script instead, inside the `pointerdown` handler and before
// the browser has recorded the press as a pointer interaction, and a script-driven focus at that
// point does match `:focus-visible` in Chromium, Firefox and WebKit alike: a menu toggle or a
// calendar date shows a keyboard ring for a mouse press. The listeners below, installed once on
// `document` (see `install`, called for its side effect from every barrel), watch for exactly
// that: the pressed element taking focus with `:focus-visible` set. Only then is its outline
// suppressed, until it blurs or a key is pressed.
//
// An element the browser focuses by itself, or doesn't focus at all (Safari leaves a clicked
// button unfocused), is never touched. Suppressing on every `pointerdown` instead, as this module
// once did, left `style="outline: none"` (`outline: medium` in Safari) on every pressed link and
// button: for good in Safari, where no blur ever came to restore it, and hiding the ring a key
// press should bring back everywhere else.
//
// Mirrors react-aria's own `@react-aria/interactions` global modality tracking (one document-level
// set of listeners rather than one per component/instance) without switching this library's focus
// rings from chassis-css's native `:focus-visible` CSS to JS-driven state — react-aria's
// `isFocusVisible` is consumed by applying a class/attribute, which would fork focus-ring styling
// from the vanilla, non-React product chassis-css also ships.
const FOCUSABLE_SELECTOR = 'a[href], button, input, select, textarea, [tabindex]'

// A press shows the ring of a text field in every browser, and should.
const NON_TEXT_INPUT_TYPES = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'image',
  'radio',
  'range',
  'reset',
  'submit'
])

function takesText(el: HTMLElement): boolean {
  if (el instanceof HTMLInputElement) return !NON_TEXT_INPUT_TYPES.has(el.type)
  return el instanceof HTMLTextAreaElement || el.isContentEditable
}

// What the listeners and `suppressFocusRing` share. It is kept on the document, not in this
// module: a module evaluated twice (a hot reload, two copies of the package in one bundle) would
// otherwise hold two sets of it, each with listeners of its own. The second then saved, as the
// outline to restore, the `none` the first had just set, and its restore ran last: the outline
// stayed off for good. Every evaluation finds the same state here, and only the first installs.
interface FocusRingState {
  installed: boolean
  // The element the last press landed on, until a key is pressed.
  pressed: HTMLElement | null
  // Each suppressed element with what puts its styles back.
  suppressed: Map<HTMLElement, () => void>
}

const STATE_KEY = Symbol.for('@chassis-ui/react/focus-ring')

function stateOf(doc: Document): FocusRingState {
  const holder = doc as Document & { [STATE_KEY]?: FocusRingState }
  return (holder[STATE_KEY] ??= { installed: false, pressed: null, suppressed: new Map() })
}

// Which ring-painting style properties a given call suppresses. The global listeners only ever
// need `outline` (that's the whole of chassis-css's `:focus-visible` ring); a
// script-driven focus redirect also clears `boxShadow`, since an element it lands on may carry a
// ring painted that way — see `focusRedirect`.
export type SuppressibleStyle = 'outline' | 'boxShadow'

const DEFAULT_STYLES: readonly SuppressibleStyle[] = ['outline']

// Shared by the global listeners below and by call sites that move focus themselves via script
// (e.g. `RangeCalendar`'s hover-to-preview-a-range, which calls `element.focus()` from a
// `pointerenter` handler — no press for the listeners to see, and `focusRedirect`, which
// delegates here rather than reimplementing the save/restore cycle).
export function suppressFocusRing(
  el: HTMLElement,
  styles: readonly SuppressibleStyle[] = DEFAULT_STYLES
): void {
  // chassis-css's `.form-input` placeholder deliberately grants its focus ring on `:focus-within`
  // as well as `:focus-visible` (see `_form.scss`), unlike the `:focus-visible`-only policy this
  // module otherwise mirrors for buttons/links/checks/etc. — a form field is meant to show its
  // ring regardless of whether the focus came from a click or the keyboard: forcing its outline
  // off here would fight, then correctly-but-uselessly restore, an outline chassis-css wants
  // visible the whole time the field is focused.
  if (el.classList.contains('form-input')) return
  // `suppressed` guards re-entrancy: a second call for the same element before it blurs (e.g. a
  // rapid re-press, the pointer re-entering a cell, or a repeated `focusRedirect` onto the same
  // element) would otherwise capture, as the value to restore, the `none` the first call set —
  // leaving the ring permanently suppressed. One shared map across every caller, so a
  // global-listener suppression and a `focusRedirect` one can't stack on each other either, nor
  // can those of two evaluations of this module.
  const { suppressed } = stateOf(el.ownerDocument)
  if (suppressed.has(el)) return

  const previous = styles.map((style) => [style, el.style[style]] as const)
  const restore = () => {
    el.removeEventListener('blur', restore)
    suppressed.delete(el)
    for (const [style, value] of previous) el.style[style] = value
    // Setting a property back to nothing leaves an empty `style=""` on an element that had none.
    if (el.getAttribute('style') === '') el.removeAttribute('style')
  }
  suppressed.set(el, restore)
  for (const [style] of previous) el.style[style] = 'none'
  el.addEventListener('blur', restore)
}

function handlePointerDown(event: PointerEvent) {
  const state = stateOf(document)
  // An element removed while in focus never blurs: without this it would be held until a key
  // is pressed.
  for (const [el, restore] of [...state.suppressed]) if (!el.isConnected) restore()
  const target = event.target
  state.pressed = target instanceof Element ? target.closest<HTMLElement>(FOCUSABLE_SELECTOR) : null
}

function handleFocusIn(event: FocusEvent) {
  const el = event.target
  if (el !== stateOf(document).pressed || !(el instanceof HTMLElement)) return
  if (takesText(el) || !el.matches(':focus-visible')) return
  suppressFocusRing(el)
}

// The keyboard is in use again: whether a ring shows is `:focus-visible`'s to say, for the element
// in focus too.
function handleKeyDown() {
  const state = stateOf(document)
  state.pressed = null
  for (const restore of [...state.suppressed.values()]) restore()
}

export function install(): void {
  if (typeof document === 'undefined') return
  const state = stateOf(document)
  if (state.installed) return
  state.installed = true
  document.addEventListener('pointerdown', handlePointerDown, true)
  document.addEventListener('focusin', handleFocusIn, true)
  document.addEventListener('keydown', handleKeyDown, true)
}

install()
