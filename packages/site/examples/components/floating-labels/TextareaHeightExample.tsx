import { FloatingInput, Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput
      label="Comments"
      ids={{ input: 'floatingTextarea2', label: 'floatingTextarea2Label' }}
    >
      <Textarea
        placeholder="Leave a comment here"
        id="floatingTextarea2"
        aria-labelledby="floatingTextarea2Label"
        style={{ height: '100px' }}
      ></Textarea>
    </FloatingInput>
  )
}
