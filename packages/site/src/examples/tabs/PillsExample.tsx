import { Tabs, TabsList, TabsTab, TabsPanel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Tabs defaultSelectedKey="home">
      <TabsList aria-label="Pills example" variant="pills">
        <TabsTab id="home">Home</TabsTab>
        <TabsTab id="profile">Profile</TabsTab>
        <TabsTab id="contact">Contact</TabsTab>
      </TabsList>
      <TabsPanel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown
        aliqua, retro synth master cleanse.
      </TabsPanel>
      <TabsPanel id="profile">
        Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid.
        Exercitation +1 labore velit, blog sartorial PBR leggings.
      </TabsPanel>
      <TabsPanel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
        lomo retro fanny pack lo-fi farm-to-table readymade.
      </TabsPanel>
    </Tabs>
  )
}
