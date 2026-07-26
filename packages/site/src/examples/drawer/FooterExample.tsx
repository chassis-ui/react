import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxDrawer,
  CxDrawerBody,
  CxDrawerFooter,
  CxDrawerHeader,
  CxDrawerTitle
} from '@chassis-ui/react'

export const FooterExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>Open drawer</CxButton>
      <CxDrawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <CxDrawerHeader>
          <CxDrawerTitle>Drawer with stacked actions</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>A drawer with multiple footer actions, stacking full-width at the small breakpoint.</p>
        </CxDrawerBody>
        <CxDrawerFooter stacked>
          <CxButton context="primary">Take action</CxButton>
          <CxButton context="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CxButton>
        </CxDrawerFooter>
      </CxDrawer>
    </>
  )
}
