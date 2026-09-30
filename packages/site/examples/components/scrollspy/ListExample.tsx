import { useRef } from 'react'
import { Col, List, ListItem, Row, Scrollspy } from '@chassis-ui/react'

const text =
  'This is some placeholder content for the scrollspy example. As the box scrolls, the item ' +
  'for the section being read is marked. It is repeated in every section, to give the box ' +
  'enough to scroll.'

const items = [1, 2, 3, 4]

export const Example = () => {
  const box = useRef<HTMLDivElement>(null)
  return (
    <Row>
      <Col span={4}>
        <Scrollspy root={box} smoothScroll>
          <List>
            {items.map((item) => (
              <ListItem key={item} href={`#list-item-${item}`}>
                Item {item}
              </ListItem>
            ))}
          </List>
        </Scrollspy>
      </Col>
      <Col span={8}>
        <div
          ref={box}
          role="region"
          aria-label="List sections"
          tabIndex={0}
          style={{ height: 200, overflowY: 'auto', position: 'relative' }}
        >
          {items.map((item) => (
            <div key={item}>
              <h4 id={`list-item-${item}`}>Item {item}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Col>
    </Row>
  )
}
