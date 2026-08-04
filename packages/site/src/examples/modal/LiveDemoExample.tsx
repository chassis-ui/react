import { useState } from 'react'
import { Button, Modal } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch demo modal</Button>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
          <Button color="primary">Save changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
