import { Button, Divider, Stack } from '@chassis-ui/react'

export const Example = () => (
  <Stack direction="vertical" style={{ maxWidth: '24rem' }}>
    <Button>Sign in with a passkey</Button>
    <Divider>or</Divider>
    <Button variant="outline">Sign in with a password</Button>
  </Stack>
)
