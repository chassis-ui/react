import React from 'react'
import { CxFormCheck, CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const OutlinedTogglesExample = () => {
  return (
    <>
      <div>
        <CxFormCheck
          button={{ context: 'primary', variant: 'outline' }}
          id="button-check-outlined"
          autoComplete="off"
          label="Single toggle"
        />
      </div>
      <div>
        <CxFormCheck
          button={{ context: 'secondary', variant: 'outline' }}
          id="button-check-2-outlined"
          autoComplete="off"
          label="Checked"
          defaultSelected
        />
      </div>
      <div>
        <CxFormRadioGroup
          aria-label="Outlined radio toggle buttons"
          defaultValue="success-outlined"
          orientation="horizontal"
        >
          <CxFormRadio
            button={{ context: 'success', variant: 'outline' }}
            value="success-outlined"
            autoComplete="off"
            label="Radio"
          />
          <CxFormRadio
            button={{ context: 'danger', variant: 'outline' }}
            value="danger-outlined"
            autoComplete="off"
            label="Radio"
          />
        </CxFormRadioGroup>
      </div>
    </>
  )
}
