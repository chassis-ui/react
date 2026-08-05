import { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visibleXL, setVisibleXL] = useState(false)
  const [visibleLg, setVisibleLg] = useState(false)
  const [visibleSm, setVisibleSm] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleXL(!visibleXL)}>Extra large modal</Button>
      <Button onClick={() => setVisibleLg(!visibleLg)}>Large modal</Button>
      <Button onClick={() => setVisibleSm(!visibleSm)}>Small modal</Button>
      <Modal size="xlarge" visible={visibleXL} onClose={() => setVisibleXL(false)}>
        <ModalHeader>
          <ModalTitle>Extra large modal</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal size="large" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <ModalHeader>
          <ModalTitle>Large modal</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal size="small" visible={visibleSm} onClose={() => setVisibleSm(false)}>
        <ModalHeader>
          <ModalTitle>Small modal</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
    </>
  )
}
