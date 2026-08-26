import { useState } from 'react'
import { ChipInput } from '@chassis-ui/react'

export const Example = () => {
  const [values, setValues] = useState<string[]>(['React'])

  return (
    <div className="vstack gap-small">
      <ChipInput aria-label="Skills" onChange={setValues} placeholder="Add skill…" value={values} />
      <div className="form-text">Current values: {values.join(', ') || '(none)'}</div>
    </div>
  )
}
