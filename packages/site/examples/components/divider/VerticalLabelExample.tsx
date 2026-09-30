import { Button, Divider, Stack } from '@chassis-ui/react'

export const Example = () => (
  <Stack gap="md">
    <Button>Sign in with a passkey</Button>
    <Divider orientation="vertical">or</Divider>
    <Button variant="outline">Sign in with a password</Button>
  </Stack>
)
