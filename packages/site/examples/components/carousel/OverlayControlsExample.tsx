import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselIndicators,
  CarouselInner,
  CarouselItem,
  CarouselOverlay,
  Placeholder
} from '@chassis-ui/react'

export const Example = () => (
  <Carousel autoplay>
    <CarouselInner>
      <CarouselItem>
        <Placeholder width={800} height={400} text="First slide" className="d-block w-100" />
      </CarouselItem>
      <CarouselItem>
        <Placeholder
          width={800}
          height={400}
          text="Second slide"
          color="success"
          className="d-block w-100"
        />
      </CarouselItem>
      <CarouselItem>
        <Placeholder
          width={800}
          height={400}
          text="Third slide"
          color="warning"
          className="d-block w-100"
        />
      </CarouselItem>
    </CarouselInner>
    <CarouselOverlay>
      <CarouselControlPrev />
      <CarouselIndicators />
      <CarouselControlNext />
    </CarouselOverlay>
  </Carousel>
)
