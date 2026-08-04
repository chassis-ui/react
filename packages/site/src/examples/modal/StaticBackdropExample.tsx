import { useState } from 'react'
import { Button, CxModal, CxModalBody, CxModalFooter, CxModalHeader, CxModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch static backdrop modal</Button>
      <CxModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <CxModalHeader>
          <CxModalTitle>Modal title</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>
          I will not close if you click outside me. Don't even try to press escape key.
        </CxModalBody>
        <CxModalFooter>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
          <Button color="primary">Save changes</Button>
        </CxModalFooter>
      </CxModal>
    </>
  )
}
