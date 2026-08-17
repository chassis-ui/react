import { Button } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Button type="submit" color="primary">
        Button
      </Button>
      <Button component="a" href="#" color="primary" role="button">
        Link
      </Button>
      <Button component="input" type="button" color="primary" value="Input" />
      <Button component="input" type="submit" color="primary" value="Submit" />
      <Button component="input" type="reset" color="primary" value="Reset" />
    </>
  )
}
