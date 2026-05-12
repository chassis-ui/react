import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxCard,
  CxCardBody,
  CxCol,
  CxCollapse,
  CxContainer,
  CxRow,
} from '@chassis-ui/react'

export const BasicExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <CxButton href="#" onClick={(event) => {
        event.preventDefault()
        setVisible(!visible)
      }}>
        Link
      </CxButton>
      <CxButton onClick={() => setVisible(!visible)}>Button</CxButton>
      <CxCollapse visible={visible}>
        <CxCard className="mt-3">
          <CxCardBody>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
            squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
            sapiente ea proident.
          </CxCardBody>
        </CxCard>
      </CxCollapse>
    </>
  )
}
