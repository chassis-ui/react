import Link from 'next/link'
import { Nav, NavItem, Scrollspy } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

const SECTIONS = ['Intro', 'Usage', 'Options', 'Events']

// The page scrolls, so `Scrollspy` takes no `root`, which a Server Component couldn't pass as a
// ref. Half the links are `next/link` elements handed over with `asChild`.
export default function Page() {
  return (
    <main>
      <Scrollspy>
        <Nav component="nav" aria-label="Sections" style={{ position: 'fixed', top: 0, right: 0 }}>
          {SECTIONS.map((section, index) =>
            index % 2 ? (
              <NavItem key={section} asChild>
                <Link href={`#${section.toLowerCase()}`}>{section}</Link>
              </NavItem>
            ) : (
              <NavItem key={section} href={`#${section.toLowerCase()}`}>
                {section}
              </NavItem>
            )
          )}
        </Nav>
      </Scrollspy>
      {SECTIONS.map((section) => (
        <section key={section} id={section.toLowerCase()} style={{ height: 1200 }}>
          <h2>
            {section} <ClientMark />
          </h2>
        </section>
      ))}
    </main>
  )
}
