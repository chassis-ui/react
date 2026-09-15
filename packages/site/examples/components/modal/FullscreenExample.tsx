import { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  const [visibleSmall, setVisibleSmall] = useState(false)
  const [visibleMedium, setVisibleMedium] = useState(false)
  const [visibleLarge, setVisibleLarge] = useState(false)
  const [visibleXlg, setVisibleXlg] = useState(false)
  const [visible2xl, setVisible2xl] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Full screen</Button>
      <Button onClick={() => setVisibleSmall(!visibleSmall)}>Full screen below sm</Button>
      <Button onClick={() => setVisibleMedium(!visibleMedium)}>Full screen below md</Button>
      <Button onClick={() => setVisibleLarge(!visibleLarge)}>Full screen below lg</Button>
      <Button onClick={() => setVisibleXlg(!visibleXlg)}>Full screen below xl</Button>
      <Button onClick={() => setVisible2xl(!visible2xl)}>Full screen below 2xl</Button>
      <Modal fullscreen visible={visible} onClose={() => setVisible(false)}>
        <ModalHeader>
          <ModalTitle>Full screen</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="sm" visible={visibleSmall} onClose={() => setVisibleSmall(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below sm</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="md" visible={visibleMedium} onClose={() => setVisibleMedium(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below md</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="lg" visible={visibleLarge} onClose={() => setVisibleLarge(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below lg</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="xl" visible={visibleXlg} onClose={() => setVisibleXlg(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below xl</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="2xl" visible={visible2xl} onClose={() => setVisible2xl(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below 2xl</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
    </>
  )
}
