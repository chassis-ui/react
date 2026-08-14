import { Flex, Placeholder } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Flex gap={'small'} wrap="wrap">
      <Placeholder color="default" width={140} height={100} />
      <Placeholder color="alternate" width={140} height={100} />
      <Placeholder color="primary" width={140} height={100} />
      <Placeholder color="secondary" width={140} height={100} />
      <Placeholder color="neutral" width={140} height={100} />
      <Placeholder color="success" width={140} height={100} />
      <Placeholder color="danger" width={140} height={100} />
      <Placeholder color="warning" width={140} height={100} />
      <Placeholder color="info" width={140} height={100} />
    </Flex>
  )
}
