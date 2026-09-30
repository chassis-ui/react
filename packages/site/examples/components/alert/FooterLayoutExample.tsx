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
      <Button onClick={() => setVisible(true)}>Leave page</Button>
      <Alert visible={visible} onVisibleChange={setVisible}>
        <AlertIcon name="info-circle-solid" />
        <AlertBody>
          <AlertTitle>Save changes?</AlertTitle>
          <AlertText>Do you want to save your changes before leaving the page?</AlertText>
        </AlertBody>
        <AlertFooter stacked>
          <Button color="primary" onClick={() => setVisible(false)}>
            Save changes
          </Button>
          <AlertCancel>Cancel</AlertCancel>
          <Button
            className="sm:me-auto"
            color="danger"
            variant="outline"
            onClick={() => setVisible(false)}
          >
            Discard
          </Button>
        </AlertFooter>
      </Alert>
    </>
  )
}
