import { Button, Spinner } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Button disabled>
        <Spinner component="span" size="small" variant="grow" aria-hidden="true" />
      </Button>
      <Button disabled>
        <Spinner component="span" size="small" variant="grow" aria-hidden="true" />
        Loading...
      </Button>
    </>
  )
}
