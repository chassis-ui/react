import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselInner,
  CarouselItem,
  Placeholder
} from '@chassis-ui/react'

const slides = ['First slide', 'Second slide', 'Third slide', 'Fourth slide', 'Fifth slide']

export const Example = () => (
  <Carousel itemsPeek="3rem" itemsGap="1rem" ends="stop">
    <CarouselInner>
      {slides.map((label) => (
        <CarouselItem key={label}>
          <Placeholder
            width={800}
            height={300}
            text={label}
            className="d-block w-100 rounded-xlarge"
          />
        </CarouselItem>
      ))}
    </CarouselInner>
    <div className="d-flex justify-content-center">
      <CarouselControlPrev />
      <CarouselControlNext />
    </div>
  </Carousel>
)
