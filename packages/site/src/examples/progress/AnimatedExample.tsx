import { Progress } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Progress animated aria-label="Basic (Primary) animated example" striped value={25} />
      <Progress animated aria-label="Success animated example" color="success" striped value={25} />
      <Progress animated aria-label="Info animated example" color="info" striped value={50} />
      <Progress animated aria-label="Warning animated example" color="warning" striped value={75} />
      <Progress animated aria-label="Danger animated example" color="danger" striped value={100} />
    </>
  )
}
