import { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleLg, setVisibleLg] = useState(false)
  const [visibleSm, setVisibleSm] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleXL(!visibleXL)}>Extra lg modal</Button>
      <Button onClick={() => setVisibleLg(!visibleLg)}>Large modal</Button>
      <Button onClick={() => setVisibleSm(!visibleSm)}>Small modal</Button>
      <Modal size="xl" visible={visibleXL} onClose={() => setVisibleXL(false)}>
        <ModalHeader>
          <ModalTitle>Extra lg modal</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal size="lg" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <ModalHeader>
          <ModalTitle>Large modal</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal size="sm" visible={visibleSm} onClose={() => setVisibleSm(false)}>
        <ModalHeader>
          <ModalTitle>Small modal</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
    </>
  )
}
