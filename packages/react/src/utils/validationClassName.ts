// Chassis-css's validation-state classes, shared by every form control that supports
// `invalid`/`valid` (Radio, Switch, RangeInput, Select, TextInput, Textarea). Returns a
// `classNames`-compatible object rather than a resolved string so callers can still combine it
// with their own base/size classes and `className` in one `classNames(...)` call.
export const validationClassName = (invalid?: boolean, valid?: boolean) => ({
  'is-invalid': invalid,
  'is-valid': valid
})
