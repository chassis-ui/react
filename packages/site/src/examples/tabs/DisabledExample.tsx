import { Tabs } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Tabs defaultSelectedKey="home">
      <Tabs.List aria-label="Example tabs with a disabled tab">
        <Tabs.Tab id="home">Home</Tabs.Tab>
        <Tabs.Tab id="profile" disabled>
          Profile
        </Tabs.Tab>
        <Tabs.Tab id="contact">Contact</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin.
      </Tabs.Panel>
      <Tabs.Panel id="profile">This panel can't be reached — Profile is disabled.</Tabs.Panel>
      <Tabs.Panel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's.
      </Tabs.Panel>
    </Tabs>
  )
}
