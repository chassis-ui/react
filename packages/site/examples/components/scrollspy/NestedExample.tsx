import { useRef } from 'react'
import { Col, Nav, NavLink, Row, Scrollspy } from '@chassis-ui/react'

const text =
  'This is some placeholder content for the scrollspy example. As the box scrolls, the link to ' +
  'the section being read is marked, and so is the link its list is nested under.'

const Section = ({ id, title, level }: { id: string; title: string; level: 4 | 5 }) => {
  const Heading = level === 4 ? 'h4' : 'h5'
  return (
    <div id={id}>
      <Heading>{title}</Heading>
      <p>{text}</p>
      <p>{text}</p>
    </div>
  )
}

export const Example = () => {
  const box = useRef<HTMLDivElement>(null)
  return (
    <Row>
      <Col span={4}>
        <Scrollspy root={box} smoothScroll>
          <Nav component="nav" variant="pills" className="flex-column" aria-label="Nested sections">
            <NavLink href="#nested-1">Item 1</NavLink>
            <Nav component="nav" variant="pills" className="flex-column" aria-label="Item 1">
              <NavLink href="#nested-1-1" className="ms-md my-2xs">
                Item 1-1
              </NavLink>
              <NavLink href="#nested-1-2" className="ms-md my-2xs">
                Item 1-2
              </NavLink>
            </Nav>
            <NavLink href="#nested-2">Item 2</NavLink>
            <NavLink href="#nested-3">Item 3</NavLink>
            <Nav component="nav" variant="pills" className="flex-column" aria-label="Item 3">
              <NavLink href="#nested-3-1" className="ms-md my-2xs">
                Item 3-1
              </NavLink>
              <NavLink href="#nested-3-2" className="ms-md my-2xs">
                Item 3-2
              </NavLink>
            </Nav>
          </Nav>
        </Scrollspy>
      </Col>
      <Col span={8}>
        <div
          ref={box}
          role="region"
          aria-label="Nested sections content"
          tabIndex={0}
          style={{ height: 300, overflowY: 'auto', position: 'relative' }}
        >
          <Section id="nested-1" title="Item 1" level={4} />
          <Section id="nested-1-1" title="Item 1-1" level={5} />
          <Section id="nested-1-2" title="Item 1-2" level={5} />
          <Section id="nested-2" title="Item 2" level={4} />
          <Section id="nested-3" title="Item 3" level={4} />
          <Section id="nested-3-1" title="Item 3-1" level={5} />
          <Section id="nested-3-2" title="Item 3-2" level={5} />
        </div>
      </Col>
    </Row>
  )
}
