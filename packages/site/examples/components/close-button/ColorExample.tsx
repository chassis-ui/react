import { CloseButton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="neutral-bg-evident d-inline-flex p-xsmall gap-small">
      <CloseButton color="primary" />
      <CloseButton color="primary" variant="solid" />
      <CloseButton color="warning" />
      <CloseButton color="warning" variant="solid" />
    </div>
  )
}
