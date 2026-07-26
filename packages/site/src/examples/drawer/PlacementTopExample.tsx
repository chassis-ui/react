import { useState } from 'react'
import { CxButton, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const PlacementTopExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>Top</CxButton>
      <CxDrawer placement="top" visible={visible} onClose={() => setVisible(false)}>
        <CxDrawerHeader>
          <CxDrawerTitle>Top drawer</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Slides down from the top.</p>
        </CxDrawerBody>
      </CxDrawer>
    </>
  )
}
