import { SearchField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <SearchField aria-label="Small" defaultValue="chassis" size="sm" />
    <SearchField aria-label="Medium" defaultValue="chassis" />
    <SearchField aria-label="Large" defaultValue="chassis" size="lg" />
  </>
)
