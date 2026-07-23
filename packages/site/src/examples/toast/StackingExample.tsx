import React from 'react'
import { CxToast, CxToastBody, CxToastHeader, CxToaster } from '@chassis-ui/react'

export const StackingExample = () => {
  return (
    <CxToaster>
      <CxToast autohide={false} visible={true}>
        <CxToastHeader closeButton>
          <svg
            className="rounded me-small"
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
      <CxToast autohide={false} visible={true}>
        <CxToastHeader closeButton>
          <svg
            className="rounded me-small"
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
    </CxToaster>
  )
}
