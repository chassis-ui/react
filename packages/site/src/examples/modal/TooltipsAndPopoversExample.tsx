import { useState } from 'react'
import { Button, Link, CxModal, CxModalBody, CxModalFooter, CxModalHeader, CxModalTitle, CxPopover, Tooltip } from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(!visible)}>Launch demo modal</Button>
      <CxModal visible={visible} onClose={() => setVisible(false)}>
        <CxModalHeader>
          <CxModalTitle>Modal title</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>
          <h5>Popover in a modal</h5>
          <p>
            This
            <CxPopover
              title="Popover title"
              content="Popover body content is set in this property."
            >
              <Button>button</Button>
            </CxPopover>{' '}
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
        </CxModalBody>
        <CxModalFooter>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Close
          </Button>
          <Button color="primary">Save changes</Button>
        </CxModalFooter>
      </CxModal>
    </>
  )
}
