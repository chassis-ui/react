import { Tabs, TabList, Tab, TabPanel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Tabs defaultSelectedKey="home">
      <TabList aria-label="Example tabs with a disabled tab">
        <Tab id="home">Home</Tab>
        <Tab id="profile" disabled>
          Profile
        </Tab>
        <Tab id="contact">Contact</Tab>
      </TabList>
      <TabPanel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin.
      </TabPanel>
      <TabPanel id="profile">This panel can't be reached — Profile is disabled.</TabPanel>
      <TabPanel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's.
      </TabPanel>
    </Tabs>
  )
}
