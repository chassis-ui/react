import { useState } from 'react'
import { CxButton, CxDrawer, CxDrawerBody, CxDrawerHeader, CxDrawerTitle } from '@chassis-ui/react'

export const BodyScrollExample = () => {
  const [visibleScrolling, setVisibleScrolling] = useState(false)
  const [visibleScrollBackdrop, setVisibleScrollBackdrop] = useState(false)
  return (
    <>
      <CxButton context="primary" onClick={() => setVisibleScrolling(true)}>
        Scrolling, no backdrop
      </CxButton>
      <CxButton context="primary" onClick={() => setVisibleScrollBackdrop(true)}>
        Scrolling with backdrop
      </CxButton>
      <CxDrawer
        backdrop={false}
        placement="start"
        scroll
        visible={visibleScrolling}
        onClose={() => setVisibleScrolling(false)}
      >
        <CxDrawerHeader>
          <CxDrawerTitle>Scrolling, no backdrop</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Body scroll is enabled and the backdrop is removed.</p>
        </CxDrawerBody>
      </CxDrawer>
      <CxDrawer
        placement="start"
        scroll
        visible={visibleScrollBackdrop}
        onClose={() => setVisibleScrollBackdrop(false)}
      >
        <CxDrawerHeader>
          <CxDrawerTitle>Scrolling with backdrop</CxDrawerTitle>
        </CxDrawerHeader>
        <CxDrawerBody>
          <p>Body scroll is enabled and the backdrop remains visible.</p>
        </CxDrawerBody>
      </CxDrawer>
    </>
  )
}
