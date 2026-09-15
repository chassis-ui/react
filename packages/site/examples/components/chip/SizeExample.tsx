import { Chip } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Chip color="primary" size="sm">
        Small
      </Chip>
      <Chip color="primary">Medium</Chip>
      <Chip color="primary" size="lg">
        Large
      </Chip>
    </>
  )
}
