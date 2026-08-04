import { useState } from 'react'
import { Button, Modal } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch static backdrop modal</Button>
      <Modal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Don't even try to press escape key.
        </Modal.Body>
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
