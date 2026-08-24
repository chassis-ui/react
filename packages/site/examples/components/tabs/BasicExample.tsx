import { Tabs, TabList, Tab, TabPanel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Tabs defaultSelectedKey="home">
      <TabList aria-label="Example tabs">
        <Tab id="home">Home</Tab>
        <Tab id="profile">Profile</Tab>
        <Tab id="contact">Contact</Tab>
      </TabList>
      <TabPanel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown
        aliqua, retro synth master cleanse.
      </TabPanel>
      <TabPanel id="profile">
        Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid.
        Exercitation +1 labore velit, blog sartorial PBR leggings.
      </TabPanel>
      <TabPanel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
        lomo retro fanny pack lo-fi farm-to-table readymade.
      </TabPanel>
    </Tabs>
  )
}
