import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Modal backdrop={false} keyboard={false} style={{ position: 'relative' }} open>
      <ModalHeader>
        <ModalTitle>Modal title</ModalTitle>
      </ModalHeader>
      <ModalBody>Modal body text goes here.</ModalBody>
      <ModalFooter>
        <Button color="secondary">Close</Button>
        <Button color="primary">Save changes</Button>
      </ModalFooter>
    </Modal>
  )
}
