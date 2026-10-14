import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Breadcrumb } from '../../src/components/breadcrumb/Breadcrumb'
import { BreadcrumbItem } from '../../src/components/breadcrumb/BreadcrumbItem'
import { Nav } from '../../src/components/nav/Nav'
import { NavItem } from '../../src/components/nav/NavItem'
import { NavLink } from '../../src/components/nav/NavLink'
import { NavTitle } from '../../src/components/nav/NavTitle'
import { Navbar } from '../../src/components/navbar/Navbar'
import { NavbarBrand } from '../../src/components/navbar/NavbarBrand'
import { NavbarNav } from '../../src/components/navbar/NavbarNav'
import { NavbarText } from '../../src/components/navbar/NavbarText'
import { NavbarToggler } from '../../src/components/navbar/NavbarToggler'
import { Pagination } from '../../src/components/pagination/Pagination'
import { PaginationItem } from '../../src/components/pagination/PaginationItem'
import { Stepper } from '../../src/components/stepper/Stepper'
import { StepperItem } from '../../src/components/stepper/StepperItem'
import { Tab } from '../../src/components/tabs/Tab'
import { TabList } from '../../src/components/tabs/TabList'
import { TabPanel } from '../../src/components/tabs/TabPanel'
import { Tabs } from '../../src/components/tabs/Tabs'

// One page of the navigation components in their main states, for a single visual regression
// screenshot (`test/visual/overview-navigation.visual.spec.ts`). None of these components has
// styles of its own: they apply `@chassis-ui/css` classes, so what can move them is a change to
// chassis-css, and one screenshot of all of them side by side catches it (#45). `NavOverflow`
// measures its items and `Scrollspy` reads the scroll position, so they aren't here: nav-overflow
// has a per-story spec, and scrollspy's only look is the active link, which the navs below show.
//
// The page has a fixed width, so the screenshot doesn't depend on the viewport, and no story-level
// state: every value is a default, nothing takes focus. A tab panel fades in when it mounts; the
// spec waits for the story's render to finish.
const meta: Meta = {
  title: 'overview/Navigation',
  tags: ['!autodocs']
}

export default meta

type Story = StoryObj

const PAGE: React.CSSProperties = {
  display: 'grid',
  gap: '2rem 3rem',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'start',
  width: 960
}

const STACK: React.CSSProperties = { display: 'grid', gap: '1rem' }

function Section({
  title,
  children,
  wide
}: {
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <section style={wide ? { ...STACK, gridColumn: '1 / -1' } : STACK}>
      <h2 className="h6 mb-0">{title}</h2>
      {children}
    </section>
  )
}

function Links({ disabled = true }: { disabled?: boolean }) {
  return (
    <>
      <NavItem>
        <NavLink href="#" active>
          Active
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#">Link</NavLink>
      </NavItem>
      {disabled && (
        <NavItem>
          <NavLink href="#" disabled>
            Disabled
          </NavLink>
        </NavItem>
      )}
    </>
  )
}

function Panels() {
  return (
    <>
      <TabPanel id="home">The home panel.</TabPanel>
      <TabPanel id="profile">The profile panel.</TabPanel>
      <TabPanel id="contact">The contact panel.</TabPanel>
    </>
  )
}

const STEPS = (
  <>
    <StepperItem>First step</StepperItem>
    <StepperItem>Past step</StepperItem>
    <StepperItem active>Current step</StepperItem>
    <StepperItem>Next step</StepperItem>
    <StepperItem>Last step</StepperItem>
  </>
)

export const Default: Story = {
  render: () => (
    <div style={PAGE}>
      <Section title="Navbar" wide>
        <Navbar expand className="bg-even" aria-label="Main navigation">
          <NavbarBrand href="#">Brand</NavbarBrand>
          <NavbarNav>
            <Links />
          </NavbarNav>
          <NavbarText>Signed in as Jane</NavbarText>
        </Navbar>
        <Navbar expand color="primary" aria-label="Colored navigation">
          <NavbarBrand href="#">Primary</NavbarBrand>
          <NavbarNav>
            <Links disabled={false} />
          </NavbarNav>
        </Navbar>
        <Navbar className="bg-even" aria-label="Collapsed navigation">
          <NavbarBrand href="#">Collapsed</NavbarBrand>
          <NavbarToggler label="Toggle navigation" />
        </Navbar>
      </Section>

      <Section title="Nav">
        {(['tabs', 'segments', 'underline'] as const).map((variant) => (
          <Nav key={variant} variant={variant} aria-label={`${variant} nav`}>
            <Links />
          </Nav>
        ))}
        <Nav aria-label="Plain nav">
          <Links />
        </Nav>
        <Nav variant="segments" layout="fill" aria-label="Filled nav">
          <Links />
        </Nav>
        {(['sm', 'lg'] as const).map((size) => (
          <Nav key={size} size={size} variant="segments" aria-label={`${size} nav`}>
            <Links disabled={false} />
          </Nav>
        ))}
        <Nav className="flex-column" aria-label="Vertical nav">
          <NavTitle>Account</NavTitle>
          <NavItem>
            <NavLink href="#" active>
              Profile
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Billing</NavLink>
          </NavItem>
          <NavTitle>Workspace</NavTitle>
          <NavItem>
            <NavLink href="#">Members</NavLink>
          </NavItem>
        </Nav>
      </Section>

      <Section title="Tabs">
        <Tabs defaultSelectedKey="home">
          <TabList aria-label="Tabs">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
            <Tab id="contact" disabled>
              Contact
            </Tab>
          </TabList>
          <Panels />
        </Tabs>
        <Tabs defaultSelectedKey="profile">
          <TabList aria-label="Segment tabs" variant="segments">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
            <Tab id="contact">Contact</Tab>
          </TabList>
          <Panels />
        </Tabs>
        <Tabs defaultSelectedKey="contact">
          <TabList aria-label="Underline tabs" variant="underline" size="sm">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
            <Tab id="contact">Contact</Tab>
          </TabList>
          <Panels />
        </Tabs>
        <Tabs
          className="d-flex align-items-start gap-md"
          defaultSelectedKey="home"
          orientation="vertical"
        >
          <TabList aria-label="Vertical tabs" variant="segments">
            <Tab id="home">Home</Tab>
            <Tab id="profile">Profile</Tab>
            <Tab id="contact">Contact</Tab>
          </TabList>
          <Panels />
        </Tabs>
      </Section>

      <Section title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Library</BreadcrumbItem>
          <BreadcrumbItem active>Data</BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb style={{ '--cx-breadcrumb-divider': "'>'" } as React.CSSProperties}>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem active>Custom divider</BreadcrumbItem>
        </Breadcrumb>
      </Section>

      <Section title="Pagination">
        <Pagination pages={10} activePage={5} aria-label="Many pages" />
        {(['lg', 'sm'] as const).map((size) => (
          <Pagination key={size} size={size} pages={3} activePage={2} aria-label={`${size}`} />
        ))}
        <Pagination align="center" pages={3} activePage={1} aria-label="Centered" />
        <Pagination align="end" pages={3} activePage={3} aria-label="End-aligned" />
        <Pagination aria-label="Links">
          <PaginationItem href="#" aria-label="Previous" disabled>
            &laquo;
          </PaginationItem>
          <PaginationItem href="#" active>
            1
          </PaginationItem>
          <PaginationItem href="#">2</PaginationItem>
          <PaginationItem href="#" aria-label="Next">
            &raquo;
          </PaginationItem>
        </Pagination>
      </Section>

      <Section title="Stepper" wide>
        <Stepper layout="horizontal">{STEPS}</Stepper>
        <Stepper layout="horizontal" icon>
          {STEPS}
        </Stepper>
        <Stepper layout="horizontal" color="secondary">
          {STEPS}
        </Stepper>
        <Stepper layout="horizontal">
          <StepperItem href="#">Linked step</StepperItem>
          <StepperItem href="#">Linked step</StepperItem>
          <StepperItem active>Current step</StepperItem>
          <StepperItem>Next step</StepperItem>
        </Stepper>
        <div style={{ width: 300 }}>
          <Stepper>{STEPS}</Stepper>
        </div>
      </Section>
    </div>
  )
}
