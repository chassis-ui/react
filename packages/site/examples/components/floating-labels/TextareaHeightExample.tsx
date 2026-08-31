import { FloatingInput, Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput label="Comments" ids={{ input: 'floatingTextarea2' }}>
      <Textarea
        placeholder="Leave a comment here"
        id="floatingTextarea2"
        style={{ height: '100px' }}
      ></Textarea>
    </FloatingInput>
  )
}
