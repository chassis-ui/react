/**
 * Whether `element` renders right-to-left.
 *
 * Reads the *computed* direction rather than react-aria's `useLocale()`. The two are deliberately
 * separate signals in this library (see the Internationalization docs page): `useLocale()` follows
 * `I18nProvider`, and drives locale-dependent behavior like which calendar system to use;
 * everything about visual layout — including which physical arrow key moves "forward" through a
 * horizontally-laid-out control — follows the `dir` attribute, which is what `getComputedStyle`
 * resolves here. A page can set one without the other, and for arrow-key navigation it's the
 * rendered order the user sees that has to match.
 */
export function isRTL(element: Element): boolean {
  return getComputedStyle(element).direction === 'rtl'
}
