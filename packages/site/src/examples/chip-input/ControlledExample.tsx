import React, { useState } from 'react'
import { CxChipInput } from '@chassis-ui/react'

export const ControlledExample = () => {
  const [values, setValues] = useState<string[]>(['React'])

  return (
    <div className="vstack gap-small">
      <CxChipInput
        aria-label="Skills"
        onChange={setValues}
        placeholder="Add skill…"
        value={values}
      />
      <div className="form-text">Current values: {values.join(', ') || '(none)'}</div>
    </div>
  )
}
