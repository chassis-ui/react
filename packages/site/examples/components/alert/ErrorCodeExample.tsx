import { useState } from 'react'
import {
  Alert,
  AlertBody,
  AlertCancel,
  AlertCode,
  AlertFooter,
  AlertIcon,
  AlertText,
  AlertTitle,
  Button
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Upload</Button>
      <Alert visible={visible} onVisibleChange={setVisible}>
        <AlertIcon name="exclamation-circle-solid" color="danger" />
        <AlertBody>
          <AlertTitle>Upload failed</AlertTitle>
          <AlertCode>ERR-1234</AlertCode>
          <AlertText>
            The server refused the file. Try again, or contact support with the code above.
          </AlertText>
        </AlertBody>
        <AlertFooter>
          <AlertCancel>Close</AlertCancel>
        </AlertFooter>
      </Alert>
    </>
  )
}
