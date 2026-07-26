import { useState } from 'react'
import { CxButton, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const PlacementEndExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>End</CxButton>
      <CxDrawer placement="end" visible={visible} onClose={() => setVisible(false)}>
        <CxDrawerHeader>
          <CxDrawerTitle>End drawer</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Slides in from the right (LTR).</p>
        </CxDrawerBody>
      </CxDrawer>
    </>
  )
}
