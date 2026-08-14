import { Flex } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex
      direction="column"
      gap="small"
      responsive={{ medium: { direction: 'row', gap: 'medium', justify: 'between' } }}
    >
      <div>First item</div>
      <div>Second item</div>
      <div>Third item</div>
    </Flex>
  )
}
