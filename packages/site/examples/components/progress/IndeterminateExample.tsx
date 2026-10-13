import { Progress } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Progress aria-label="Loading page" height={4} indeterminate />
      <Progress color="success" indeterminate label="Connecting" />
      <Progress animated indeterminate label="Uploading" striped />
    </>
  )
}
