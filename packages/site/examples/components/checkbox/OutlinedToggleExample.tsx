import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <div>
        <Checkbox
          button={{ color: 'primary', variant: 'outline' }}
          id="button-check-outlined"
          label="Single toggle"
        />
      </div>
      <div>
        <Checkbox
          button={{ color: 'secondary', variant: 'outline' }}
          id="button-check-2-outlined"
          label="Checked"
          defaultSelected
        />
      </div>
    </>
  )
}
