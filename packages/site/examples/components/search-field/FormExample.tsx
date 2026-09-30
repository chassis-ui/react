import { useState } from 'react'
import { Button, SearchField, Stack } from '@chassis-ui/react'

export const Example = () => {
  const [submitted, setSubmitted] = useState('')
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))))
      }}
    >
      <Stack direction="vertical" gap="md" style={{ maxWidth: '20rem' }}>
        <SearchField
          help={submitted ? `Submitted: ${submitted}` : undefined}
          label="Search"
          name="q"
        />
        <Button type="submit">Search</Button>
      </Stack>
    </form>
  )
}
