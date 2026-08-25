import { useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  useModal
} from '@chassis-ui/react'

const Footer = () => {
  const { close } = useModal()
  return (
    <ModalFooter>
      <Button color="secondary" onClick={close}>
        Cancel
      </Button>
      <Button color="primary" onClick={close}>
        Save changes
      </Button>
    </ModalFooter>
  )
}

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Launch modal</Button>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <ModalHeader>
          <ModalTitle>Modal title</ModalTitle>
        </ModalHeader>
        <ModalBody>
          Both footer buttons close this modal — via <code>useModal()</code>, not a prop passed down
          from the parent.
        </ModalBody>
        <Footer />
      </Modal>
    </>
  )
}
