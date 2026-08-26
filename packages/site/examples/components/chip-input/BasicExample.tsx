import { ChipInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ChipInput
      aria-label="Skills"
      defaultValue={['React', 'TypeScript']}
      placeholder="Add skill…"
      chipVariant="primary smooth"
    />
  )
}
