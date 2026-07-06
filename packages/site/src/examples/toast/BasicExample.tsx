import React from 'react'
import { useState, useRef } from 'react'
import {
  CxButton,
  CxCloseButton,
  CxToast,
  CxToastBody,
  CxToastClose,
  CxToastHeader,
  CxToaster,
} from '@chassis-ui/react'

export const BasicExample = () => {
  const [toast, addToast] = useState(0)
  const toaster = useRef()
  const exampleToast = (
    <CxToast title="Chassis">
      <CxToastHeader close>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <strong className="me-auto">Chassis</strong>
        <small>7 min ago</small>
      </CxToastHeader>
      <CxToastBody>Hello, world! This is a toast message.</CxToastBody>
    </CxToast>
  )
  return (
    <>
      <CxButton onClick={() => addToast(exampleToast)}>Send a toast</CxButton>
      <CxToaster ref={toaster} push={toast} placement="top-end" />
    </>
  )
}
