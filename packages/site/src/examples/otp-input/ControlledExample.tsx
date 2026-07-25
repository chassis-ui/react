import React, { useState } from 'react'
import { CxOtpInput } from '@chassis-ui/react'

export const ControlledExample = () => {
  const [value, setValue] = useState('')
  const [complete, setComplete] = useState<string | null>(null)

  return (
    <div className="vstack gap-small">
      <CxOtpInput
        aria-label="Verification code"
        length={4}
        onChange={setValue}
        onComplete={setComplete}
        value={value}
      />
      <div className="form-text">
        Current value: {value || '(empty)'}
        {complete && <> — complete: {complete}</>}
      </div>
    </div>
  )
}
