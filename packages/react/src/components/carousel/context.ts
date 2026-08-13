import { createContext } from 'react'

export type CarouselEnds = 'loop' | 'wrap' | 'stop'

export interface CarouselContextProps {
  activeIndex: number
  atEnd: boolean
  atStart: boolean
  ends: CarouselEnds
  itemCount: number
  itemsVisible: number
  next: () => void
  playing: boolean
  prev: () => void
  registerControl: (kind: 'prev' | 'next', element: HTMLButtonElement) => () => void
  registerViewport: (node: HTMLDivElement | null) => void
  to: (index: number) => void
  togglePlayPause: () => void
}

export const CarouselContext = createContext({} as CarouselContextProps)
