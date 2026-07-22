import React from 'react'
import { useState } from 'react'
import { CxButton, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const PlacementBottomExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>Bottom</CxButton>
      <CxDrawer placement="bottom" visible={visible} onClose={() => setVisible(false)}>
        <CxDrawerHeader>
          <CxDrawerTitle>Bottom drawer</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Slides up from the bottom.</p>
        </CxDrawerBody>
      </CxDrawer>
    </>
  )
}
