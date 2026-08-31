import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <div>
        <Checkbox
          button={{ color: 'primary', variant: 'outline' }}
          id="button-check-outlined"
          autoComplete="off"
          label="Single toggle"
        />
      </div>
      <div>
        <Checkbox
          button={{ color: 'secondary', variant: 'outline' }}
          id="button-check-2-outlined"
          autoComplete="off"
          label="Checked"
          defaultSelected
        />
      </div>
    </>
  )
}
