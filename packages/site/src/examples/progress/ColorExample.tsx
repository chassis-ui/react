import { Progress } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Progress aria-label="Basic (Primary) example" value={25} />
      <Progress aria-label="Default example" color="default" value={25} />
      <Progress aria-label="Success example" color="success" value={25} />
      <Progress aria-label="Info example" color="info" value={50} />
      <Progress aria-label="Warning example" color="warning" value={75} />
      <Progress aria-label="Danger example" color="danger" value={100} />
    </>
  )
}
