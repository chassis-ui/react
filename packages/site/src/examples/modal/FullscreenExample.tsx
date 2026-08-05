import { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalTitle } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  const [visibleSmall, setVisibleSmall] = useState(false)
  const [visibleMedium, setVisibleMedium] = useState(false)
  const [visibleLarge, setVisibleLarge] = useState(false)
  const [visibleXlarge, setVisibleXlarge] = useState(false)
  const [visible2xlarge, setVisible2xlarge] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Full screen</Button>
      <Button onClick={() => setVisibleSmall(!visibleSmall)}>Full screen below small</Button>
      <Button onClick={() => setVisibleMedium(!visibleMedium)}>Full screen below medium</Button>
      <Button onClick={() => setVisibleLarge(!visibleLarge)}>Full screen below large</Button>
      <Button onClick={() => setVisibleXlarge(!visibleXlarge)}>Full screen below xlarge</Button>
      <Button onClick={() => setVisible2xlarge(!visible2xlarge)}>Full screen below 2xlarge</Button>
      <Modal fullscreen visible={visible} onClose={() => setVisible(false)}>
        <ModalHeader>
          <ModalTitle>Full screen</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="small" visible={visibleSmall} onClose={() => setVisibleSmall(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below small</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="medium" visible={visibleMedium} onClose={() => setVisibleMedium(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below medium</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="large" visible={visibleLarge} onClose={() => setVisibleLarge(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below large</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="xlarge" visible={visibleXlarge} onClose={() => setVisibleXlarge(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below xlarge</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
      <Modal fullscreen="2xlarge" visible={visible2xlarge} onClose={() => setVisible2xlarge(false)}>
        <ModalHeader>
          <ModalTitle>Full screen below 2xlarge</ModalTitle>
        </ModalHeader>
        <ModalBody>...</ModalBody>
      </Modal>
    </>
  )
}
