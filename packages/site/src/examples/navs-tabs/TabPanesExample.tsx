import React from 'react'
import { useState } from 'react'
import { CxNav, CxNavItem, CxNavLink, CxTabContent, CxTabPane } from '@chassis-ui/react'

export const TabPanesExample = () => {
  const [activeKey, setActiveKey] = useState(1)
  return (
    <>
      <CxNav variant="tabs" role="tablist">
        <CxNavItem>
          <CxNavLink
            href="javascript:void(0);"
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            Home
          </CxNavLink>
        </CxNavItem>
        <CxNavItem>
          <CxNavLink
            href="javascript:void(0);"
            active={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            Profile
          </CxNavLink>
        </CxNavItem>
        <CxNavItem>
          <CxNavLink
            href="javascript:void(0);"
            active={activeKey === 3}
            onClick={() => setActiveKey(3)}
          >
            Contact
          </CxNavLink>
        </CxNavItem>
      </CxNav>
      <CxTabContent>
        <CxTabPane role="tabpanel" aria-labelledby="home-tab" visible={activeKey === 1}>
          Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown
          aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan
          helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh
          mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan
          aliquip quis cardigan american apparel, butcher voluptate nisi qui.
        </CxTabPane>
        <CxTabPane role="tabpanel" aria-labelledby="profile-tab" visible={activeKey === 2}>
          Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid.
          Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan
          four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft
          beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic,
          assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero
          magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit,
          sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party
          scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.
        </CxTabPane>
        <CxTabPane role="tabpanel" aria-labelledby="contact-tab" visible={activeKey === 3}>
          Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
          lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork
          tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie
          helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
          Williamsburg banh mi whatever gluten-free, carles pitchfork biodiesel fixie etsy retro
          mlkshk vice blog. Scenester cred you probably haven't heard of them, vinyl craft beer blog
          stumptown. Pitchfork sustainable tofu synth chambray yr.
        </CxTabPane>
      </CxTabContent>
    </>
  )
}
