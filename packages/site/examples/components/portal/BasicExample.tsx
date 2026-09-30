import { useState } from 'react'
import { Button, Portal } from '@chassis-ui/react'

export const Example = () => {
  const [shown, setShown] = useState(false)
  return (
    <>
      <Button color="primary" onClick={() => setShown((value) => !value)}>
        {shown ? 'Hide' : 'Show'} the banner
      </Button>
      {shown && (
        <Portal>
          <div className="position-fixed bottom-0 end-0 m-lg p-md bg-primary fg-white">
            Rendered into document.body
          </div>
        </Portal>
      )}
    </>
  )
}
