import { CxChipInput } from '@chassis-ui/react'

export const VariantExample = () => {
  return (
    <div className="vstack gap-medium">
      <CxChipInput
        aria-label="Status"
        chipVariant="primary"
        defaultValue={['Approved', 'Verified']}
        placeholder="Add status…"
      />
      <CxChipInput
        aria-label="Issue labels"
        chipVariant="danger smooth"
        defaultValue={['Bug', 'Critical']}
        placeholder="Add label…"
      />
    </div>
  )
}
