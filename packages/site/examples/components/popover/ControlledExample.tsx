import { useState } from 'react'
import { Button, Popover } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="d-flex align-items-center gap-sm">
      <Popover
        title="Saved filters"
        content={
          <Button size="sm" onClick={() => setVisible(false)}>
            Apply and close
          </Button>
        }
        placement="bottom"
        visible={visible}
        onVisibleChange={setVisible}
      >
        <Button color="secondary">Filters</Button>
      </Popover>
      <span className="form-text">Popover is {visible ? 'open' : 'closed'}.</span>
    </div>
  )
}
