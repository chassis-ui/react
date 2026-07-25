import React from 'react'
import { CxTab, CxTabList, CxTabPanel, CxTabs } from '@chassis-ui/react'

export const DisabledExample = () => {
  return (
    <CxTabs defaultSelectedKey="home">
      <CxTabList aria-label="Example tabs with a disabled tab">
        <CxTab id="home">Home</CxTab>
        <CxTab id="profile" disabled>
          Profile
        </CxTab>
        <CxTab id="contact">Contact</CxTab>
      </CxTabList>
      <CxTabPanel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin.
      </CxTabPanel>
      <CxTabPanel id="profile">This panel can't be reached — Profile is disabled.</CxTabPanel>
      <CxTabPanel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's.
      </CxTabPanel>
    </CxTabs>
  )
}
