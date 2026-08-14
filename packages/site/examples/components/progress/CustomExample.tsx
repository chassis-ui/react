import { Progress, Flex } from '@chassis-ui/react'

export const Example = () => {
  const value = 25
  return (
    <Flex gap="xsmall" align="center">
      <div>Progress:</div>
      <Progress aria-label="Basic example" value={value} className="w-100" />
      <div className="ms-auto">{value}%</div>
    </Flex>
  )
}
