import { Flex, Placeholder } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex gap="md" wrap="wrap" align="center">
      <Placeholder src="https://placehold.co/160x100" alt="" fluid />
      <Placeholder src="https://placehold.co/160x100" alt="" thumbnail />
      <Placeholder src="https://placehold.co/160x100" alt="" rounded />
    </Flex>
  )
}
