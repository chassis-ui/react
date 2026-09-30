import { useState } from 'react'
import { SearchField } from '@chassis-ui/react'

export const Example = () => {
  const [searched, setSearched] = useState('')
  return (
    <SearchField
      help={searched ? `Searched for “${searched}”.` : 'Press Enter to search.'}
      label="Search"
      onClear={() => setSearched('')}
      onSubmit={setSearched}
    />
  )
}
