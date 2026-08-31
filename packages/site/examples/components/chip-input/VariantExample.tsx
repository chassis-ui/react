import { ChipInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="vstack gap-medium">
      <ChipInput
        aria-label="Status"
        chipVariant="primary"
        defaultValue={['Approved', 'Verified']}
        placeholder="Add status…"
      />
      <ChipInput
        aria-label="Issue labels"
        chipVariant="danger smooth"
        defaultValue={['Bug', 'Critical']}
        placeholder="Add label…"
      />
    </div>
  )
}
