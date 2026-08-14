import { useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch static backdrop modal</Button>
      <Modal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <ModalHeader>
          <ModalTitle>Modal title</ModalTitle>
        </ModalHeader>
        <ModalBody>
          I will not close if you click outside me. Don't even try to press escape key.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
          <Button color="primary">Save changes</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
