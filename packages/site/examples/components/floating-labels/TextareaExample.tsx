import { FloatingInput, Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput label="Comments" ids={{ input: 'floatingTextarea' }}>
      <Textarea id="floatingTextarea" placeholder="Leave a comment here"></Textarea>
    </FloatingInput>
  )
}
