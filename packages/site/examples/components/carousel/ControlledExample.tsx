import { useState } from 'react'
import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselInner,
  CarouselItem,
  Placeholder
} from '@chassis-ui/react'

export const Example = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="vstack gap-small">
      <Carousel activeIndex={activeIndex} onSlide={({ to }) => setActiveIndex(to)} ends="stop">
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
        <div className="d-flex justify-content-center">
          <CarouselControlPrev />
          <CarouselControlNext />
        </div>
      </Carousel>
      <div className="form-text">Active slide: {activeIndex + 1}</div>
    </div>
  )
}
