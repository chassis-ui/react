import React from 'react'
import { CxTab, CxTabList, CxTabPanel, CxTabs } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxTabs defaultSelectedKey="home">
      <CxTabList aria-label="Example tabs">
        <CxTab id="home">Home</CxTab>
        <CxTab id="profile">Profile</CxTab>
        <CxTab id="contact">Contact</CxTab>
      </CxTabList>
      <CxTabPanel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown
        aliqua, retro synth master cleanse.
      </CxTabPanel>
      <CxTabPanel id="profile">
        Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid.
        Exercitation +1 labore velit, blog sartorial PBR leggings.
      </CxTabPanel>
      <CxTabPanel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
        lomo retro fanny pack lo-fi farm-to-table readymade.
      </CxTabPanel>
    </CxTabs>
  )
}
