import { useState } from 'react'
import { Button, Stack, TimeField } from '@chassis-ui/react'

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
        <TimeField
          help={submitted ? `Submitted: ${submitted}` : undefined}
          label="Start"
          name="start"
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  )
}
