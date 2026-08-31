import { Flex } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex
      wrap="wrap"
      alignContent="between"
      gap="small"
      style={{ width: '200px', height: '220px' }}
    >
      <div>One</div>
      <div>Two</div>
      <div>Three</div>
      <div>Four</div>
      <div>Five</div>
    </Flex>
  )
}
