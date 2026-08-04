import { Carousel as CarouselRoot } from './Carousel'
import { CarouselCaption } from './CarouselCaption'
import { CarouselItem } from './CarouselItem'
// plop:sub-import

export const Carousel = Object.assign(CarouselRoot, {
  // plop:sub-entry
  Caption: CarouselCaption,
  Item: CarouselItem
})
export type { CarouselProps } from './Carousel'
export type { CarouselCaptionProps } from './CarouselCaption'
export type { CarouselItemProps } from './CarouselItem'
// plop:sub-type
