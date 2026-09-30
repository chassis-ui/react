import { useState } from 'react'
import { Button, DatePicker } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="vstack gap-sm">
      <div className="d-flex align-items-center gap-2">
        <DatePicker aria-label="Event date" visible={visible} onVisibleChange={setVisible} />
        <Button color="secondary" onClick={() => setVisible(true)} type="button">
          Open calendar
        </Button>
      </div>
      <div className="form-text">Popover is {visible ? 'open' : 'closed'}.</div>
    </div>
  )
}
