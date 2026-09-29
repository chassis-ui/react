import { Tab, TabList, TabPanel, Tabs } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <Tabs defaultSelectedKey="first">
        <TabList aria-label="Sections">
          <Tab id="first">First</Tab>
          <Tab id="second">Second</Tab>
        </TabList>
        <TabPanel id="first">
          First panel <ClientMark />
        </TabPanel>
        <TabPanel id="second">
          Second panel <ClientMark />
        </TabPanel>
      </Tabs>
    </main>
  )
}
