import { FloatingInput, Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput label="Comments">
      <Textarea placeholder="Leave a comment here" style={{ height: '100px' }}></Textarea>
    </FloatingInput>
  )
}
