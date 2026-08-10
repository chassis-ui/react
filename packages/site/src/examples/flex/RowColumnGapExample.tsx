import { Flex } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex wrap="wrap" rowGap="xlarge" columnGap="xsmall" style={{ width: '200px' }}>
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
    </Flex>
  )
}
