import { useState } from 'react'
import {
  Alert,
  AlertBody,
  AlertCancel,
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
      <Button color="danger" onClick={() => setVisible(true)}>
        Delete file
      </Button>
      <Alert visible={visible} onVisibleChange={setVisible}>
        <AlertIcon name="exclamation-triangle-solid" color="danger" />
        <AlertBody>
          <AlertTitle>Delete the file?</AlertTitle>
          <AlertText>This file will be removed for everyone. This can't be undone.</AlertText>
        </AlertBody>
        <AlertFooter>
          <Button color="danger" onClick={() => setVisible(false)}>
            Delete file
          </Button>
          <AlertCancel>Cancel</AlertCancel>
        </AlertFooter>
      </Alert>
    </>
  )
}
