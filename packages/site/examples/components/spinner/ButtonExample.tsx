import { Button, Spinner } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Button disabled>
        <Spinner component="span" size="small" aria-hidden="true" />
      </Button>
      <Button disabled>
        <Spinner component="span" size="small" aria-hidden="true" />
        Loading...
      </Button>
    </>
  )
}
