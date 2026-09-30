// An id-reference attribute (`aria-describedby`, `aria-labelledby`) from the ids that apply, or
// `undefined` when none does, so the attribute is left out rather than written empty.
export const joinIds = (...ids: (string | false | null | undefined)[]): string | undefined =>
  ids.filter(Boolean).join(' ') || undefined

// `value` without the given ids: for an id-reference attribute a react-aria hook built from ids
// that may not be rendered, such as the description and error-message ids of its `useField`.
export const withoutIds = (
  value: string | undefined,
  ...ids: (string | undefined)[]
): string | undefined => joinIds(...(value?.split(' ') ?? []).filter((id) => !ids.includes(id)))

// `props` with the ids of react-aria's description and error-message slots taken out of its
// `aria-describedby`. `useField` always writes both into the server's HTML and drops each only
// after hydration, once it finds no element with that id: this library renders its own help and
// feedback under other ids. See FORMS.md, gotcha 6.
export const withoutSlotIds = <P extends { 'aria-describedby'?: string }>(
  props: P,
  ...slots: { id?: string }[]
): P => ({
  ...props,
  'aria-describedby': withoutIds(props['aria-describedby'], ...slots.map((slot) => slot.id))
})
