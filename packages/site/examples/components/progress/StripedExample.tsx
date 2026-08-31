import { Progress } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Progress aria-label="Basic (Primary) striped example" striped value={25} />
      <Progress aria-label="Default striped example" color="default" striped value={25} />
      <Progress aria-label="Success striped example" color="success" striped value={25} />
      <Progress aria-label="Info striped example" color="info" striped value={50} />
      <Progress aria-label="Warning striped example" color="warning" striped value={75} />
      <Progress aria-label="Danger striped example" color="danger" striped value={100} />
    </>
  )
}
