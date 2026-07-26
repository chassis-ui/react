import React from 'react'
import { CxPasswordStrength } from '@chassis-ui/react'

const samples: { label: string; password: string }[] = [
  { label: 'Weak', password: 'abc' },
  { label: 'Fair', password: 'abcdefgh1' },
  { label: 'Good', password: 'Abcdefgh1234' },
  { label: 'Strong', password: 'Sup3r!Secret!Passphrase99' }
]

export const LevelsExample = () => {
  return (
    <div className="vstack gap-medium">
      {samples.map(({ label, password }) => (
        <div key={label}>
          <div className="fg-medium">{label}</div>
          <CxPasswordStrength aria-label={`${label} example`} value={password} />
        </div>
      ))}
    </div>
  )
}
