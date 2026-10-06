import { Flex } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex gap="md">
      <div className="flex-fill">Fills the row</div>
      <div>As wide as its content</div>
      <div className="flex-fill">Fills the row</div>
    </Flex>
  )
}
