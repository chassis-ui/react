import { Flex } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      gap={{ base: 'sm', md: 'md' }}
      justify={{ md: 'between' }}
    >
      <div>First item</div>
      <div>Second item</div>
      <div>Third item</div>
    </Flex>
  )
}
