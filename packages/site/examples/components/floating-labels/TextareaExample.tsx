import { FloatingInput, Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FloatingInput
      label="Comments"
      ids={{ input: 'floatingTextarea', label: 'floatingTextareaLabel' }}
    >
      <Textarea
        id="floatingTextarea"
        aria-labelledby="floatingTextareaLabel"
        placeholder="Leave a comment here"
      ></Textarea>
    </FloatingInput>
  )
}
