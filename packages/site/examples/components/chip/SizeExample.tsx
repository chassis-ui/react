import { Chip } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Chip color="primary" size="small">
        Small
      </Chip>
      <Chip color="primary">Medium</Chip>
      <Chip color="primary" size="large">
        Large
      </Chip>
    </>
  )
}
