import React, { useState } from 'react'
import {
  CxButton,
  CxModal,
  CxModalBody,
  CxModalFooter,
  CxModalHeader,
  CxModalTitle
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
        <CxModalBody>Woohoo, you're reading this text in a modal!</CxModalBody>
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
