import React from 'react'
import { useState } from 'react'
import { CxButton, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const FullscreenExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>Fullscreen</CxButton>
      <CxDrawer fullscreen placement="bottom" visible={visible} onClose={() => setVisible(false)}>
        <CxDrawerHeader>
          <CxDrawerTitle>Fullscreen drawer</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Fills the full viewport inset area.</p>
        </CxDrawerBody>
      </CxDrawer>
    </>
  )
}
