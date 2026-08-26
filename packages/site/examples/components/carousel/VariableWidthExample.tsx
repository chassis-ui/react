import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselInner,
  CarouselItem,
  Placeholder
} from '@chassis-ui/react'

const slides = [
  { label: 'A', width: 160 },
  { label: 'B', width: 320 },
  { label: 'C', width: 220 },
  { label: 'D', width: 380 },
  { label: 'E', width: 200 },
  { label: 'F', width: 300 }
]

export const Example = () => (
  <Carousel auto itemsGap="1rem" ends="stop">
    <CarouselInner>
      {slides.map(({ label, width }) => (
        <CarouselItem key={label} style={{ width }}>
          <Placeholder width={width} height={200} text={label} className="d-block w-100 rounded" />
        </CarouselItem>
      ))}
    </CarouselInner>
    <div className="d-flex justify-content-center">
      <CarouselControlPrev />
      <CarouselControlNext />
    </div>
  </Carousel>
)
