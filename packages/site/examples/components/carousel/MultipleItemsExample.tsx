import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselInner,
  CarouselItem,
  Placeholder
} from '@chassis-ui/react'

const slides = ['1', '2', '3', '4', '5', '6', '7']

export const Example = () => (
  <Carousel items={3} itemsGap="1rem" ends="stop">
    <CarouselInner>
      {slides.map((label) => (
        <CarouselItem key={label}>
          <Placeholder width={260} height={200} text={label} className="d-block w-100 rounded" />
        </CarouselItem>
      ))}
    </CarouselInner>
    <div className="d-flex justify-content-center">
      <CarouselControlPrev />
      <CarouselControlNext />
    </div>
  </Carousel>
)
