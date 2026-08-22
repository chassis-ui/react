import { Chip } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Chip color="primary">Span</Chip>
      <Chip component="div" color="primary">
        Div
      </Chip>
      <Chip component="button" color="primary">
        Button
      </Chip>
      <Chip href="#" role="button" color="primary">
        Link
      </Chip>
    </>
  )
}
