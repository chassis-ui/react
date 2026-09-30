import { NavOverflow, Tab, TabList, TabPanel, Tabs } from '@chassis-ui/react'

const sections = ['Overview', 'Details', 'History', 'Activity', 'Comments', 'Attachments']

export const Example = () => (
  <Tabs defaultSelectedKey="Overview">
    <NavOverflow>
      <TabList aria-label="Sections">
        {sections.map((section) => (
          <Tab key={section} id={section}>
            {section}
          </Tab>
        ))}
      </TabList>
    </NavOverflow>
    {sections.map((section) => (
      <TabPanel key={section} id={section} className="p-md">
        The {section.toLowerCase()} panel.
      </TabPanel>
    ))}
  </Tabs>
)
