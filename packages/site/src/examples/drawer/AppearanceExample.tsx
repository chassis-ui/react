import { useState } from 'react'
import { Button, CxDrawer, CxDrawerBody, CxDrawerFooter, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const AppearanceExample = () => {
  const [visibleSheet, setVisibleSheet] = useState(false)
  const [visibleTranslucent, setVisibleTranslucent] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleSheet(true)}>Sheet</Button>
      <Button onClick={() => setVisibleTranslucent(true)}>Translucent</Button>
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
          <Button color="neutral" onClick={() => setVisibleSheet(false)}>
            Close
          </Button>
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
          <Button color="neutral" onClick={() => setVisibleTranslucent(false)}>
            Close
          </Button>
        </CxDrawerFooter>
      </CxDrawer>
    </>
  )
}
