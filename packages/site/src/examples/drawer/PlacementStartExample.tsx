import React from 'react'
import { useState } from 'react'
import { CxButton, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const PlacementStartExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>Start</CxButton>
      <CxDrawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <CxDrawerHeader>
          <CxDrawerTitle>Start drawer</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Slides in from the left (LTR).</p>
        </CxDrawerBody>
      </CxDrawer>
    </>
  )
}
