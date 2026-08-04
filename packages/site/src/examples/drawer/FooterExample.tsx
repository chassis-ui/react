import { useState } from 'react'
import { Button, CxDrawer, CxDrawerBody, CxDrawerFooter, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const FooterExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open drawer</Button>
      <CxDrawer placement="start" visible={visible} onClose={() => setVisible(false)}>
        <CxDrawerHeader>
          <CxDrawerTitle>Drawer with stacked actions</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>A drawer with multiple footer actions, stacking full-width at the small breakpoint.</p>
        </CxDrawerBody>
        <CxDrawerFooter stacked>
          <Button color="primary">Take action</Button>
          <Button color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </Button>
        </CxDrawerFooter>
      </CxDrawer>
    </>
  )
}
