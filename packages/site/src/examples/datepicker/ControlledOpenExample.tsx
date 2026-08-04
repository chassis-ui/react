import { useState } from 'react'
import { CxButton, CxDatePicker } from '@chassis-ui/react'

export const ControlledOpenExample = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="vstack gap-small">
      <div className="d-flex align-items-center gap-2">
        <CxDatePicker aria-label="Event date" isOpen={isOpen} onOpenChange={setIsOpen} />
        <CxButton color="secondary" onClick={() => setIsOpen(true)} type="button">
          Open calendar
        </CxButton>
      </div>
      <div className="form-text">Popover is {isOpen ? 'open' : 'closed'}.</div>
    </div>
  )
}
