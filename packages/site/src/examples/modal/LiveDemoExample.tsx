import { useState } from 'react'
import { Button, CxModal, CxModalBody, CxModalFooter, CxModalHeader, CxModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch demo modal</Button>
      <CxModal visible={visible} onClose={() => setVisible(false)}>
        <CxModalHeader>
          <CxModalTitle>Modal title</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>Woohoo, you're reading this text in a modal!</CxModalBody>
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
