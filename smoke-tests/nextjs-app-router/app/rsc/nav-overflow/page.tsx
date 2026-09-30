import Link from 'next/link'
import { Nav, NavItem, NavOverflow, Tab, TabList, TabPanel, Tabs } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

const PAGES = ['Dashboard', 'Products', 'Services', 'Analytics', 'Reports', 'Settings']
const SECTIONS = ['Overview', 'Details', 'History', 'Activity', 'Comments', 'Attachments']

// Too narrow for either list: the server sends every item, and the browser moves the ones that
// don't fit into the menu. The links are `next/link` elements handed over with `asChild`.
export default function Page() {
  return (
    <main>
      <div style={{ width: 320 }}>
        <NavOverflow component="nav" aria-label="Pages">
          <Nav>
            <NavItem asChild active>
              <Link href="/rsc/nav-overflow">Home</Link>
            </NavItem>
            {PAGES.map((page) => (
              <NavItem key={page} asChild>
                <Link href={`/rsc/nav-overflow?page=${page.toLowerCase()}`}>{page}</Link>
              </NavItem>
            ))}
          </Nav>
        </NavOverflow>
      </div>
      <div style={{ width: 320 }}>
        <Tabs defaultSelectedKey="Overview">
          <NavOverflow>
            <TabList aria-label="Sections">
              {SECTIONS.map((section) => (
                <Tab key={section} id={section}>
                  {section}
                </Tab>
              ))}
            </TabList>
          </NavOverflow>
          {SECTIONS.map((section) => (
            <TabPanel key={section} id={section}>
              {section} panel <ClientMark />
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
