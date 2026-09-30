import { useState } from 'react'
import { Alert, AlertBody, AlertFooter, AlertText, AlertTitle, Button } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Show alert</Button>
      <Alert closeButton closeLabel="Close alert" visible={visible} onVisibleChange={setVisible}>
        <AlertBody>
          <AlertTitle>Your session is about to expire</AlertTitle>
          <AlertText>
            Renew it to keep working, or close this and be signed out in 2 minutes.
          </AlertText>
        </AlertBody>
        <AlertFooter>
          <Button color="primary" onClick={() => setVisible(false)}>
            Renew session
          </Button>
        </AlertFooter>
      </Alert>
    </>
  )
}
