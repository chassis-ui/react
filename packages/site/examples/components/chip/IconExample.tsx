import { Chip, Icon } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Chip color="default">
        <Icon name="info-circle-solid" aria-hidden="true" />
        <span>Default</span>
      </Chip>
      <Chip color="primary">
        <span>Primary</span>
        <Icon name="info-circle-solid" aria-hidden="true" />
      </Chip>
    </>
  )
}
