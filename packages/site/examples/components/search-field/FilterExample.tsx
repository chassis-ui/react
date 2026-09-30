import { useState } from 'react'
import { List, ListItem, SearchField, Stack } from '@chassis-ui/react'

const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Cherry', 'Grape', 'Mango', 'Peach']

export const Example = () => {
  const [query, setQuery] = useState('')
  const matches = fruits.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))
  return (
    <Stack direction="vertical" gap="md" style={{ maxWidth: '20rem' }}>
      <SearchField label="Filter fruits" onChange={setQuery} value={query} />
      <List>
        {matches.map((fruit) => (
          <ListItem key={fruit}>{fruit}</ListItem>
        ))}
        {matches.length === 0 && <ListItem>No fruit matches “{query}”.</ListItem>}
      </List>
    </Stack>
  )
}
