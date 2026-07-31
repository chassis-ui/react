import { useState } from 'react'
import {
  CxButton,
  CxDrawer,
  CxDrawerBody,
  CxDrawerFooter,
  CxDrawerHeader,
  CxDrawerTitle
} from '@chassis-ui/react'

export const AppearanceExample = () => {
  const [visibleSheet, setVisibleSheet] = useState(false)
  const [visibleTranslucent, setVisibleTranslucent] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisibleSheet(true)}>Sheet</CxButton>
      <CxButton onClick={() => setVisibleTranslucent(true)}>Translucent</CxButton>
      <CxDrawer
        sheet
        placement="start"
        visible={visibleSheet}
        onClose={() => setVisibleSheet(false)}
      >
        <CxDrawerHeader>
          <CxDrawerTitle>Sheet drawer</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Flush against the viewport edge — no inset, rounding, or border.</p>
        </CxDrawerBody>
        <CxDrawerFooter>
          <CxButton color="neutral" onClick={() => setVisibleSheet(false)}>
            Close
          </CxButton>
        </CxDrawerFooter>
      </CxDrawer>
      <CxDrawer
        translucent
        placement="start"
        visible={visibleTranslucent}
        onClose={() => setVisibleTranslucent(false)}
      >
        <CxDrawerHeader>
          <CxDrawerTitle>Translucent drawer</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Frosted-glass background over the page content.</p>
        </CxDrawerBody>
        <CxDrawerFooter>
          <CxButton color="neutral" onClick={() => setVisibleTranslucent(false)}>
            Close
          </CxButton>
        </CxDrawerFooter>
      </CxDrawer>
    </>
  )
}
