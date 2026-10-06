import { useRef } from 'react'
import { Grid, GridItem, Link, Scrollspy } from '@chassis-ui/react'

const text =
  'This is some placeholder content for the scrollspy example. As the box scrolls, the link to ' +
  'the section being read is marked. It is repeated in every section, to give the box enough ' +
  'to scroll.'

const items = [1, 2, 3, 4, 5]

export const Example = () => {
  const box = useRef<HTMLDivElement>(null)
  return (
    <Grid gap="md">
      <GridItem span={4}>
        <Scrollspy root={box} smoothScroll>
          <nav aria-label="Sections" className="d-flex flex-column gap-xs text-center">
            {items.map((item) => (
              <Link key={item} href={`#links-item-${item}`} className="p-2xs rounded">
                Item {item}
              </Link>
            ))}
          </nav>
        </Scrollspy>
      </GridItem>
      <GridItem span={8}>
        <div
          ref={box}
          role="region"
          aria-label="Link sections"
          tabIndex={0}
          style={{ height: 200, overflowY: 'auto', position: 'relative' }}
        >
          {items.map((item) => (
            <div key={item}>
              <h4 id={`links-item-${item}`}>Item {item}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </GridItem>
    </Grid>
  )
}
