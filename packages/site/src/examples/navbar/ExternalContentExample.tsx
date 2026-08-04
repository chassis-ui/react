import { useState } from 'react'
import { Container, Collapse, Navbar } from '@chassis-ui/react'

export const ExternalContentExample = () => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Collapse id="navbarToggleExternalContent" visible={visible}>
        <div className="bg-dark p-4">
          <h5 className="text-white h4">Collapsed content</h5>
          <span className="medium:text-emphasis-inverse">Toggleable via the navbar brand.</span>
        </div>
      </Collapse>
      <Navbar colorScheme="dark" className="bg-dark">
        <Container fluid>
          <Navbar.Toggler
            aria-controls="navbarToggleExternalContent"
            aria-label="Toggle navigation"
            onClick={() => setVisible(!visible)}
          />
        </Container>
      </Navbar>
    </>
  )
}
