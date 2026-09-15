import { CloseButton } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <div className="context primary p-xs d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
      <div className="context primary solid p-xs d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
      <div className="context warning p-xs d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
      <div className="context warning solid p-xs d-inline-flex">
        <CloseButton />
        <CloseButton disabled />
      </div>
    </>
  )
}
