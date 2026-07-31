import { useState } from 'react'
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
      <CxButton onClick={() => setVisible(!visible)}>Launch static backdrop modal</CxButton>
      <CxModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
        <CxModalHeader>
          <CxModalTitle>Modal title</CxModalTitle>
        </CxModalHeader>
        <CxModalBody>
          I will not close if you click outside me. Don't even try to press escape key.
        </CxModalBody>
        <CxModalFooter>
          <CxButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CxButton>
          <CxButton color="primary">Save changes</CxButton>
        </CxModalFooter>
      </CxModal>
    </>
  )
}
