import { Tabs, TabsList, TabsTab, TabsPanel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Tabs defaultSelectedKey="home">
      <TabsList aria-label="Example tabs with a disabled tab">
        <TabsTab id="home">Home</TabsTab>
        <TabsTab id="profile" disabled>
          Profile
        </TabsTab>
        <TabsTab id="contact">Contact</TabsTab>
      </TabsList>
      <TabsPanel id="home">
        Raw denim you probably haven't heard of them jean shorts Austin.
      </TabsPanel>
      <TabsPanel id="profile">This panel can't be reached — Profile is disabled.</TabsPanel>
      <TabsPanel id="contact">
        Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's.
      </TabsPanel>
    </Tabs>
  )
}
