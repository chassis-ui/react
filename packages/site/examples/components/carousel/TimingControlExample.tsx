import {
  Carousel,
  CarouselIndicators,
  CarouselInner,
  CarouselItem,
  CarouselPlayPause,
  Placeholder
} from '@chassis-ui/react'

export const Example = () => (
  <Carousel autoplay>
    <CarouselInner>
      <CarouselItem interval={2000}>
        <Placeholder width={800} height={400} text="First: 2 seconds" className="d-block w-100" />
      </CarouselItem>
      <CarouselItem interval={4000}>
        <Placeholder
          width={800}
          height={400}
          text="Second: 4 seconds"
          color="success"
          className="d-block w-100"
        />
      </CarouselItem>
      <CarouselItem interval={6000}>
        <Placeholder
          width={800}
          height={400}
          text="Third: 6 seconds"
          color="warning"
          className="d-block w-100"
        />
      </CarouselItem>
    </CarouselInner>
    <div className="d-flex justify-content-between align-items-center mt-3">
      <CarouselPlayPause />
      <CarouselIndicators />
    </div>
  </Carousel>
)
