import { useState } from 'react'
import { Button, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const FullscreenExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Fullscreen</Button>
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
