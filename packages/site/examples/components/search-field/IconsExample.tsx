import { SearchField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <SearchField aria-label="Without the search icon" defaultValue="chassis" searchIcon={false} />
    <SearchField
      aria-label="Other icons"
      clearIcon="xmark-circle-solid"
      defaultValue="chassis"
      searchIcon="search-solid"
    />
  </>
)
