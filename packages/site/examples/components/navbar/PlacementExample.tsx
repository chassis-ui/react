import { useState, type ChangeEvent } from 'react'
import { Container, Navbar, NavbarBrand, Select } from '@chassis-ui/react'

type Placement = 'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom'

export const Example = () => {
  const [placement, setPlacement] = useState<Placement>('fixed-top')
  const handlePlacementChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPlacement(e.target.value as Placement)
  }
  return (
    <Navbar className="bg-even" placement={placement}>
      <Container fluid>
        <NavbarBrand>Navbar</NavbarBrand>
        <Select
          id="navbar-placement"
          className="w-auto"
          value={placement}
          onChange={handlePlacementChange}
          options={[
            { label: 'Fixed top', value: 'fixed-top' },
            { label: 'Fixed bottom', value: 'fixed-bottom' },
            { label: 'Sticky top', value: 'sticky-top' },
            { label: 'Sticky bottom', value: 'sticky-bottom' }
          ]}
        />
      </Container>
    </Navbar>
  )
}
