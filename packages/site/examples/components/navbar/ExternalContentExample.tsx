import { useState } from 'react'
import {
  Container,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerTitle,
  Navbar,
  NavbarToggler
} from '@chassis-ui/react'

export const Example = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Drawer
        id="navbarToggleExternalContent"
        placement="top"
        data-cx-theme="dark"
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <DrawerHeader>
          <DrawerTitle>Collapsed content</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <span className="fg-main">Toggleable via the navbar toggler.</span>
        </DrawerBody>
      </Drawer>
      <Navbar className="bg-body" data-cx-theme="dark">
        <Container fluid>
          <NavbarToggler
            aria-controls="navbarToggleExternalContent"
            aria-expanded={visible}
            aria-label="Toggle navigation"
            onClick={() => setVisible(!visible)}
          />
        </Container>
      </Navbar>
    </>
  )
}
