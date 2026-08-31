import {
  Button,
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselInner,
  CarouselItem
} from '@chassis-ui/react'

export const Example = () => (
  <Carousel>
    <CarouselInner>
      <CarouselItem>
        <div
          className="d-flex flex-column justify-content-center primary-bg-even p-6xlarge"
          style={{ minHeight: 320 }}
        >
          <h3>Build anything</h3>
          <p>Compose slides from any markup — text, buttons, cards, or media.</p>
          <div>
            <Button color="primary" href="#">
              Get started
            </Button>
          </div>
        </div>
      </CarouselItem>
      <CarouselItem>
        <div
          className="d-flex flex-column justify-content-center text-center success-bg-even p-6xlarge"
          style={{ minHeight: 320 }}
        >
          <h3>Style it any way</h3>
          <p>Use utilities or custom CSS to size and theme each slide.</p>
          <div>
            <Button color="success" href="#">
              Learn more
            </Button>
          </div>
        </div>
      </CarouselItem>
      <CarouselItem>
        <div
          className="d-flex flex-column justify-content-center text-end warning-bg-even p-6xlarge"
          style={{ minHeight: 320 }}
        >
          <h3>Mix and match</h3>
          <p>Combine custom content with controls, indicators, and the overlay layout.</p>
          <div>
            <Button color="black" href="#">
              Browse examples
            </Button>
          </div>
        </div>
      </CarouselItem>
    </CarouselInner>
    <div className="d-flex justify-content-center">
      <CarouselControlPrev />
      <CarouselControlNext />
    </div>
  </Carousel>
)
