import React, { Children, createContext, Fragment, isValidElement, ReactNode } from 'react'

import { isElementOfType } from '../../utils/lazyElement'
import { CarouselItem } from './CarouselItem'

// Internal to the carousel family (see CONVENTIONS.md's helper-module carve-out).
//
// The carousel finds its slides in the DOM (`getCarouselItems`), which a server doesn't have: the
// first render drew no indicators and no active slide, so a `fade` carousel, whose inactive
// slides are transparent, was blank until the JavaScript had loaded. These read the slides from
// `CarouselInner`'s children instead, the way the server sees them.

export interface SlidePosition {
  count: number
  index: number
}

// Each slide's position, from `CarouselInner` to its `CarouselItem`. Unset when `CarouselInner`
// can't tell (see `readSlides`), and for a slide of a carousel nested inside another one's slide,
// which its own `CarouselInner` resets.
export const SlidePositionContext = createContext<SlidePosition | undefined>(undefined)

export interface Slides {
  // `children` with fragments flattened, each keyed as React would key it.
  nodes: ReactNode[]
  // Whether every one of them is a `CarouselItem`. Anything else, such as a slide inside a
  // component of your own, sits somewhere among them that this can't see, and a position counted
  // without it would contradict the DOM's.
  positioned: boolean
}

export function readSlides(children: ReactNode): Slides {
  const nodes = flatten(children)
  return { nodes, positioned: nodes.every((node) => isElementOfType(node, CarouselItem)) }
}

function flatten(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isElementOfType<{ children?: ReactNode }>(child, Fragment)
      ? flatten(child.props.children).map((node) =>
          isValidElement(node)
            ? React.cloneElement(node, { key: `${child.key}/${node.key}` })
            : node
        )
      : [child]
  )
}
