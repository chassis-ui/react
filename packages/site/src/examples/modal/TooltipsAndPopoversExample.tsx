import { useState } from 'react'
import {
  CxButton,
  CxLink,
  CxModal,
  CxModalBody,
  CxModalFooter,
  CxModalHeader,
  CxModalTitle,
  CxPopover,
  CxTooltip
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(!visible)}>Launch demo modal</CxButton>
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
              <CxButton>button</CxButton>
            </CxPopover>{' '}
            triggers a popover on click.
          </p>
          <hr />
          <h5>Tooltips in a modal</h5>
          <p>
            <CxTooltip content="Tooltip">
              <CxLink>This link</CxLink>
            </CxTooltip>{' '}
            and
            <CxTooltip content="Tooltip">
              <CxLink>that link</CxLink>
            </CxTooltip>{' '}
            have tooltips on hover.
          </p>
        </CxModalBody>
        <CxModalFooter>
          <CxButton context="secondary" onClick={() => setVisible(false)}>
            Close
          </CxButton>
          <CxButton context="primary">Save changes</CxButton>
        </CxModalFooter>
      </CxModal>
    </>
  )
}
