import React, { FC } from 'react'
import PropTypes from 'prop-types'

interface TocItem {
  url: string
  title: string
  items?: TocItem[]
}

interface TocProps {
  items: { items?: TocItem[] }
}

const TocList: FC<{ items: TocItem[]; level: number }> = ({ items, level }) => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>
        <a href={item.url} className={`level-${level}`}>
          {item.title}
        </a>
        {item.items && item.items.length > 0 && <TocList items={item.items} level={level + 1} />}
      </li>
    ))}
  </ul>
)

TocList.displayName = 'TocList'

const Toc: FC<TocProps> = ({ items }) => {
  if (!items?.items?.length) return null
  return <TocList items={items.items} level={1} />
}

Toc.propTypes = {
  items: PropTypes.any,
}

Toc.displayName = 'Toc'

export default Toc
