import React from 'react'
import { useState } from 'react'
import { CxButton, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const StaticBackdropExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>Static backdrop</CxButton>
      <CxDrawer
        backdrop="static"
        placement="start"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <CxDrawerHeader>
          <CxDrawerTitle>Static backdrop</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Clicking outside nudges this drawer rather than closing it.</p>
        </CxDrawerBody>
      </CxDrawer>
    </>
  )
}
