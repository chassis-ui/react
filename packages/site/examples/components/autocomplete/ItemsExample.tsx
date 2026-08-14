import { Autocomplete } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete
      aria-label="Timezone"
      placeholder="Choose a timezone…"
      items={[
        { type: 'header', id: 'americas', label: 'Americas' },
        { id: 'est', label: 'Eastern Time' },
        { id: 'cst', label: 'Central Time' },
        { type: 'header', id: 'europe', label: 'Europe' },
        { id: 'gmt', label: 'Greenwich Mean Time' },
        { id: 'cet', label: 'Central European Time' }
      ]}
    />
  )
}
