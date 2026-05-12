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

export const BackdropExample = () => {
  const [visibleScrolling, setVisibleScrolling] = useState(false)
  const [visibleWithBackdrop, setVisibleWithBackdrop] = useState(false)
  const [visibleWithBothOptions, setVisibleWithBothOptions] = useState(false)
  return (
    <>
      <CxButton context="primary" onClick={() => setVisibleScrolling(true)}>Enable body scrolling</CxButton>
      <CxButton context="primary" onClick={() => setVisibleWithBackdrop(true)}>Enable backdrop (default)</CxButton>
      <CxButton context="primary" onClick={() => setVisibleWithBothOptions(true)}>Enable both scrolling &amp; backdrop</CxButton>
      <CxOffcanvas backdrop={false} placement="start" scroll visible={visibleScrolling} onHide={() => setVisibleScrolling(false)}>
        <CxOffcanvasHeader>
          <CxOffcanvasTitle>Offcanvas</CxOffcanvasTitle>
          <CxCloseButton className="text-reset" onClick={() => setVisibleScrolling(false)}/>
        </CxOffcanvasHeader>
        <CxOffcanvasBody>
          <p>Try scrolling the rest of the page to see this option in action.</p>
        </CxOffcanvasBody>
      </CxOffcanvas>
      <CxOffcanvas placement="start" visible={visibleWithBackdrop} onHide={() => setVisibleWithBackdrop(false)}>
        <CxOffcanvasHeader>
          <CxOffcanvasTitle>Offcanvas</CxOffcanvasTitle>
          <CxCloseButton className="text-reset" onClick={() => setVisibleWithBackdrop(false)}/>
        </CxOffcanvasHeader>
        <CxOffcanvasBody>
          <p>.....</p>
        </CxOffcanvasBody>
      </CxOffcanvas>
      <CxOffcanvas placement="start" scroll visible={visibleWithBothOptions} onHide={() => setVisibleWithBothOptions(false)}>
        <CxOffcanvasHeader>
          <CxOffcanvasTitle>Offcanvas</CxOffcanvasTitle>
          <CxCloseButton className="text-reset" onClick={() => setVisibleWithBothOptions(false)}/>
        </CxOffcanvasHeader>
        <CxOffcanvasBody>
          <p>Try scrolling the rest of the page to see this option in action.</p>
        </CxOffcanvasBody>
      </CxOffcanvas>
    </>
  )
}
