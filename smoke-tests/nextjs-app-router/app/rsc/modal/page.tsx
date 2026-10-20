import { Modal, ModalBody, ModalHeader, ModalTitle } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

// Rendered open, so its server HTML is labelled by the title it reads from its children, whose
// types arrive here as lazy wrappers.
export default function Page() {
  return (
    <main>
      <Modal backdrop={false} keyboard={false} open>
        <ModalHeader>
          <ModalTitle id="rsc-modal-title">
            Modal title <ClientMark />
          </ModalTitle>
        </ModalHeader>
        <ModalBody>Modal body</ModalBody>
      </Modal>
    </main>
  )
}
