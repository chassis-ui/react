import { createContext } from 'react'

// A `Form`'s `validated`, read by every field through `useHeldBack` to show itself as valid or
// invalid by its own constraints. See FORMS.md, gotcha 10.
export const FormValidatedContext = createContext(false)
