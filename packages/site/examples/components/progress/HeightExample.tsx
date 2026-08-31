import { Progress } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Progress aria-label="1px high example" height={1} value={25} />
      <Progress aria-label="20px high example" height={20} value={25} />
    </>
  )
}
