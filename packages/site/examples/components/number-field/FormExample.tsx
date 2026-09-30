import { useState } from 'react'
import { Button, NumberField, Stack } from '@chassis-ui/react'

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
        <NumberField
          defaultValue={1250.5}
          formatOptions={{ currency: 'EUR', style: 'currency' }}
          help={submitted ? `Submitted: ${submitted}` : undefined}
          label="Price"
          name="price"
        />
        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  )
}
