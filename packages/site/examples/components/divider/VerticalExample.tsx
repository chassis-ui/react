import { Button, Divider, Stack } from '@chassis-ui/react'

export const Example = () => (
  <Stack gap="md">
    <Button variant="basic">Edit</Button>
    <Button variant="basic">Duplicate</Button>
    <Divider orientation="vertical" />
    <Button variant="basic" color="danger">
      Delete
    </Button>
  </Stack>
)
