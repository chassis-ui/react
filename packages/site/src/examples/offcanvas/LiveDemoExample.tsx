import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxCloseButton,
  CxOffcanvas,
  CxOffcanvasBody,
  CxOffcanvasHeader,
  CxOffcanvasTitle,
} from '@chassis-ui/react'

export const LiveDemoExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton onClick={() => setVisible(true)}>Toggle offcanvas</CxButton>
      <CxOffcanvas placement="start" visible={visible} onHide={() => setVisible(false)}>
        <CxOffcanvasHeader>
          <CxOffcanvasTitle>Offcanvas</CxOffcanvasTitle>
          <CxCloseButton className="text-reset" onClick={() => setVisible(false)} />
        </CxOffcanvasHeader>
        <CxOffcanvasBody>
          Content for the offcanvas goes here. You can place just about any Bootstrap React component or
          custom elements here.
        </CxOffcanvasBody>
      </CxOffcanvas>
    </>
  )
}
