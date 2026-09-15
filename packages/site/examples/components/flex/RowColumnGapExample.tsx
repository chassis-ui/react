import { Flex } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex wrap="wrap" rowGap="xl" columnGap="xs" style={{ width: '200px' }}>
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
    </Flex>
  )
}
