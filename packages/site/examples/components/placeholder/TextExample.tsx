import { Flex, Placeholder } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex gap="medium" wrap="wrap">
      <Placeholder width={200} height={120} title="Cover" text="No cover yet" />
      <Placeholder width={200} height={120} title={false} text="Coming soon" />
      <Placeholder width={200} height={120} text={false} />
    </Flex>
  )
}
