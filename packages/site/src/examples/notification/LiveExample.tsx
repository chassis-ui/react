import React from 'react'
import { useState } from 'react'
import { 
  CxNotification,
  CxNotificationHeading,
  CxNotificationLink,
  CxButton,
} from '@chassis-ui/react'

export const LiveExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxNotification context="primary" dismissible visible={visible} onClose={() => setVisible(false)}>A simple primary notification—check it out!</CxNotification>
      <CxButton context="primary" onClick={() => setVisible(true)}>Show live notification</CxButton>
    </>
  )
}
