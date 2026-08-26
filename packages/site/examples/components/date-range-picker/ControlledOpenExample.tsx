import { useState } from 'react'
import { Button, DateRangePicker } from '@chassis-ui/react'

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="vstack gap-small">
      <div className="d-flex align-items-center gap-2">
        <DateRangePicker aria-label="Trip dates" isOpen={isOpen} onOpenChange={setIsOpen} />
        <Button color="secondary" onClick={() => setIsOpen(true)} type="button">
          Open calendar
        </Button>
      </div>
      <div className="form-text">Popover is {isOpen ? 'open' : 'closed'}.</div>
    </div>
  )
}
