import { useState } from 'react'
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Popover,
  Tooltip
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch demo modal</Button>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <ModalHeader>
          <ModalTitle>Modal title</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <h5>Popover in a modal</h5>
          <p>
            This
            <Popover title="Popover title" content="Popover body content is set in this property.">
              <Button>button</Button>
            </Popover>{' '}
            triggers a popover on click.
          </p>
          <hr />
          <h5>Tooltips in a modal</h5>
          <p>
            <Tooltip content="Tooltip">
              <Link>This link</Link>
            </Tooltip>{' '}
            and
            <Tooltip content="Tooltip">
              <Link>that link</Link>
            </Tooltip>{' '}
            have tooltips on hover.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
          <Button color="primary">Save changes</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
