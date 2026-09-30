import { SearchField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <SearchField defaultValue="chassis" disabled label="Disabled" />
    <SearchField defaultValue="chassis" label="Read only" readOnly />
    <SearchField
      defaultValue="c"
      invalid
      invalidFeedback="Type at least two letters."
      label="Invalid"
    />
    <SearchField defaultValue="chassis" label="Valid" valid validFeedback="12 results." />
  </>
)
