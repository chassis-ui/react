import { Flex } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex gap="medium">
      <div>First item</div>
      <div className="ms-auto">Second item</div>
      <div>Third item</div>
    </Flex>
  )
}
