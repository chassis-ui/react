import { useState } from 'react'
import { Button, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const StaticBackdropExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Static backdrop</Button>
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
