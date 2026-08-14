import { ChipInput } from '@chassis-ui/react'

export const BasicExample = () => {
  return (
    <ChipInput
      aria-label="Skills"
      defaultValue={['React', 'TypeScript']}
      placeholder="Add skill…"
    />
  )
}
