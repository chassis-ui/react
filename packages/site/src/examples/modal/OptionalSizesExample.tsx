import { useState } from 'react'
import { Button, Modal } from '@chassis-ui/react'

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
        <Modal.Header>
          <Modal.Title>Extra large modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal size="large" visible={visibleLg} onClose={() => setVisibleLg(false)}>
        <Modal.Header>
          <Modal.Title>Large modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
      <Modal size="small" visible={visibleSm} onClose={() => setVisibleSm(false)}>
        <Modal.Header>
          <Modal.Title>Small modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
      </Modal>
    </>
  )
}
