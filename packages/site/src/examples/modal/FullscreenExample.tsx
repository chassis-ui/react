import { useState } from 'react'
import { Button, Modal } from '@chassis-ui/react'

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
      <Button onClick={() => setVisible2xlarge(!visible2xlarge)}>
        Full screen below 2xlarge
      </Button>
      <Modal fullscreen visible={visible} onClose={() => setVisible(false)}>
        <Modal.Header>
          <Modal.Title>Full screen</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal fullscreen="small" visible={visibleSmall} onClose={() => setVisibleSmall(false)}>
        <Modal.Header>
          <Modal.Title>Full screen below small</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal fullscreen="medium" visible={visibleMedium} onClose={() => setVisibleMedium(false)}>
        <Modal.Header>
          <Modal.Title>Full screen below medium</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal fullscreen="large" visible={visibleLarge} onClose={() => setVisibleLarge(false)}>
        <Modal.Header>
          <Modal.Title>Full screen below large</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal fullscreen="xlarge" visible={visibleXlarge} onClose={() => setVisibleXlarge(false)}>
        <Modal.Header>
          <Modal.Title>Full screen below xlarge</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal
        fullscreen="2xlarge"
        visible={visible2xlarge}
        onClose={() => setVisible2xlarge(false)}
      >
        <Modal.Header>
          <Modal.Title>Full screen below 2xlarge</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
    </>
  )
}
