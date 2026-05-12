import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

export type NavItem = {
  name: string
  to: string
  items?: NavItem[]
}

interface SidebarNavProps {
  items: NavItem[]
  currentRoute: string
}

const normalize = (path: string) => path?.replace(/\/?$/, '/') ?? ''

export const SidebarNav = ({ items, currentRoute }: SidebarNavProps) => {
  const route = normalize(currentRoute)
  return (
    <nav className="cxd-links w-100" id="cxd-docs-nav" aria-label="Docs navigation">
      {items.map((group, groupIndex) => {
        const groupActive = route.startsWith(normalize(group.to))

        if (group.items) {
          return (
            <li key={groupIndex} className={`cxd-links-group${groupActive ? ' active' : ''}`}>
              <strong className="cxd-links-heading">{group.name}</strong>
              <ul className="nav flex-column cxd-links-nav">
                {group.items.map((item, itemIndex) => {
                  if (item.items) {
                    return (
                      <React.Fragment key={itemIndex}>
                        <li className="cxd-links-subgroup">{item.name}</li>
                        {item.items.map((subItem, subIndex) => {
                          const active = route === normalize(subItem.to) || route.startsWith(normalize(subItem.to))
                          return (
                            <li key={subIndex}>
                              <Link
                                to={subItem.to}
                                className={`cxd-links-link${active ? ' active' : ''}`}
                                aria-current={active ? 'page' : undefined}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          )
                        })}
                      </React.Fragment>
                    )
                  }
                  const active = route === normalize(item.to) || route.startsWith(normalize(item.to))
                  return (
                    <li key={itemIndex}>
                      <Link
                        to={item.to}
                        className={`cxd-links-link${active ? ' active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        }

        const active = route === normalize(group.to)
        return (
          <React.Fragment key={groupIndex}>
            <li className="cxd-links-span-all mt-2xsmall mb-medium mx-large border-top" />
            <Link
              to={group.to}
              className={`cxd-links-link cxd-links-span-all${active ? ' active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {group.name}
            </Link>
          </React.Fragment>
        )
      })}
    </nav>
  )
}

SidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  currentRoute: PropTypes.string.isRequired,
}
