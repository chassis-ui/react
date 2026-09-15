import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Container } from '../../src/components/grid/Container'
import { Drawer } from '../../src/components/drawer/Drawer'
import { DrawerBody } from '../../src/components/drawer/DrawerBody'
import { DrawerHeader } from '../../src/components/drawer/DrawerHeader'
import { DrawerTitle } from '../../src/components/drawer/DrawerTitle'
import { Navbar } from '../../src/components/navbar/Navbar'
import { NavbarBrand } from '../../src/components/navbar/NavbarBrand'
import { NavbarNav } from '../../src/components/navbar/NavbarNav'
import { NavbarText } from '../../src/components/navbar/NavbarText'
import { NavbarToggler } from '../../src/components/navbar/NavbarToggler'
import { NavItem } from '../../src/components/nav/NavItem'
import { NavLink } from '../../src/components/nav/NavLink'

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  title: 'navbar/Navbar'
}

export default meta

type Story = StoryObj<typeof Navbar>

export const BrandOnly: Story = {
  render: () => (
    <Navbar className="bg-even">
      <Container fluid>
        <NavbarBrand href="#">Navbar</NavbarBrand>
      </Container>
    </Navbar>
  )
}

export const WithText: Story = {
  render: () => (
    <Navbar className="bg-even">
      <Container fluid>
        <NavbarText>Navbar text with an inline element</NavbarText>
      </Container>
    </Navbar>
  )
}

export const WithCollapsibleNav: Story = {
  render: function NavbarWithNav() {
    const [visible, setVisible] = useState(false)
    return (
      <Navbar expand="sm" className="bg-even">
        <Container fluid>
          <NavbarBrand href="#">Navbar</NavbarBrand>
          <NavbarToggler
            aria-controls="navbarNav"
            aria-expanded={visible}
            aria-label="Toggle navigation"
            onClick={() => setVisible(!visible)}
          />
          <Drawer
            id="navbarNav"
            placement="end"
            visible={visible}
            onClose={() => setVisible(false)}
          >
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              <NavbarNav>
                <NavItem>
                  <NavLink href="#" active>
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#">Link</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink disabled>Disabled</NavLink>
                </NavItem>
              </NavbarNav>
            </DrawerBody>
          </Drawer>
        </Container>
      </Navbar>
    )
  }
}
