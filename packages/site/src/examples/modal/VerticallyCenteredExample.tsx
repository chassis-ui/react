import React from 'react'
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
  CxTooltip,
} from '@chassis-ui/react'

export const VerticallyCenteredExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(!visible)}>Vertically centered modal</CxButton>
      <CxModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CxModalHeader>
          <CxModalTitle>Modal title</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
          in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
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
