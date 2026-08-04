import { Tabs } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Tabs defaultSelectedKey="home">
      <Tabs.List aria-label="Example tabs">
        <Tabs.Tab id="home">Home</Tabs.Tab>
        <Tabs.Tab id="profile">Profile</Tabs.Tab>
        <Tabs.Tab id="contact">Contact</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown
        aliqua, retro synth master cleanse.
      </Tabs.Panel>
      <Tabs.Panel id="profile">
        Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid.
        Exercitation +1 labore velit, blog sartorial PBR leggings.
      </Tabs.Panel>
      <Tabs.Panel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
        lomo retro fanny pack lo-fi farm-to-table readymade.
      </Tabs.Panel>
    </Tabs>
  )
}
