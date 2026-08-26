import { Stack } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="contains-inline">
      <Stack direction="vertical" gap="medium" responsive={{ small: 'horizontal' }}>
        <button type="button" className="button primary">
          Primary action
        </button>
        <button type="button" className="button primary outline">
          Cancel
        </button>
      </Stack>
    </div>
  )
}
