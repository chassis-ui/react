import { CloseButton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <div className="context primary p-xsmall d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
      <div className="context primary solid p-xsmall d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
      <div className="context warning p-xsmall d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
      <div className="context warning solid p-xsmall d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
    </>
  )
}
