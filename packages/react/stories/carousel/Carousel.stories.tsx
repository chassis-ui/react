import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Carousel } from '../../src/components/carousel/Carousel'
import { CarouselControlNext } from '../../src/components/carousel/CarouselControlNext'
import { CarouselControlPrev } from '../../src/components/carousel/CarouselControlPrev'
import { CarouselIndicators } from '../../src/components/carousel/CarouselIndicators'
import { CarouselInner } from '../../src/components/carousel/CarouselInner'
import { CarouselItem } from '../../src/components/carousel/CarouselItem'
import { CarouselOverlay } from '../../src/components/carousel/CarouselOverlay'
import { Placeholder } from '../../src/components/placeholder/Placeholder'

const meta: Meta<typeof Carousel> = {
  component: Carousel,
  title: 'carousel/Carousel'
}
export default meta

type Story = StoryObj<typeof Carousel>

// Autoplay is deliberately not exercised by any story here: a real scroll-snap animation is
// wall-clock/rAF-driven (see carouselEngine.ts's animateScrollTo), and every story below is meant
// to render its final, settled state on first paint so a screenshot never races a still-in-flight
// transition — matching accordion/collapse's static-story precedent, not toast/notification's
// wait-for-settled-class one.
const threeSlides = (
  <>
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
  </>
)

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <CarouselControlPrev />
            <CarouselControlNext />
          </div>
          <CarouselIndicators />
        </div>
        <CarouselInner>{threeSlides}</CarouselInner>
      </>
    )
  }
}

export const MultipleItems: Story = {
  args: {
    items: 3,
    itemsGap: '1rem',
    ends: 'stop',
    children: (
      <>
        <CarouselInner>
          {['1', '2', '3', '4', '5', '6', '7'].map((label) => (
            <CarouselItem key={label}>
              <Placeholder
                width={260}
                height={200}
                text={label}
                className="d-block w-100 rounded"
              />
            </CarouselItem>
          ))}
        </CarouselInner>
        <div className="d-flex justify-content-center">
          <CarouselControlPrev />
          <CarouselControlNext />
        </div>
      </>
    )
  }
}

export const Peeking: Story = {
  args: {
    itemsPeek: '3rem',
    itemsGap: '1rem',
    ends: 'stop',
    children: (
      <>
        <CarouselInner>
          {['First slide', 'Second slide', 'Third slide', 'Fourth slide', 'Fifth slide'].map(
            (label) => (
              <CarouselItem key={label}>
                <Placeholder
                  width={800}
                  height={300}
                  text={label}
                  className="d-block w-100 rounded-xlarge"
                />
              </CarouselItem>
            )
          )}
        </CarouselInner>
        <div className="d-flex justify-content-center">
          <CarouselControlPrev />
          <CarouselControlNext />
        </div>
      </>
    )
  }
}

// Pairs `center` with `itemsPeek`, per the docs' own recommendation (carousel.mdx).
export const Centered: Story = {
  args: {
    center: true,
    itemsPeek: '4rem',
    itemsGap: '1rem',
    ends: 'stop',
    defaultActiveIndex: 2,
    children: (
      <>
        <CarouselInner>
          {['First slide', 'Second slide', 'Third slide', 'Fourth slide', 'Fifth slide'].map(
            (label) => (
              <CarouselItem key={label}>
                <Placeholder
                  width={800}
                  height={300}
                  text={label}
                  className="d-block w-100 rounded-xlarge"
                />
              </CarouselItem>
            )
          )}
        </CarouselInner>
        <div className="d-flex justify-content-center">
          <CarouselControlPrev />
          <CarouselControlNext />
        </div>
      </>
    )
  }
}

export const VariableWidth: Story = {
  args: {
    auto: true,
    itemsGap: '1rem',
    ends: 'stop',
    children: (
      <>
        <CarouselInner>
          {[
            { label: 'A', width: 160 },
            { label: 'B', width: 320 },
            { label: 'C', width: 220 },
            { label: 'D', width: 380 },
            { label: 'E', width: 200 },
            { label: 'F', width: 300 }
          ].map(({ label, width }) => (
            <CarouselItem key={label} style={{ width }}>
              <Placeholder
                width={width}
                height={200}
                text={label}
                className="d-block w-100 rounded"
              />
            </CarouselItem>
          ))}
        </CarouselInner>
        <div className="d-flex justify-content-center">
          <CarouselControlPrev />
          <CarouselControlNext />
        </div>
      </>
    )
  }
}

export const Fade: Story = {
  args: {
    transition: 'fade',
    children: (
      <>
        <CarouselInner>{threeSlides}</CarouselInner>
        <CarouselOverlay>
          <CarouselControlPrev />
          <CarouselControlNext />
        </CarouselOverlay>
      </>
    )
  }
}

export const OverlayControls: Story = {
  args: {
    children: (
      <>
        <CarouselInner>{threeSlides}</CarouselInner>
        <CarouselOverlay>
          <CarouselControlPrev />
          <CarouselIndicators />
          <CarouselControlNext />
        </CarouselOverlay>
      </>
    )
  }
}

export const EndsStop: Story = {
  args: {
    ends: 'stop',
    children: (
      <>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <CarouselControlPrev />
            <CarouselControlNext />
          </div>
          <CarouselIndicators />
        </div>
        <CarouselInner>{threeSlides}</CarouselInner>
      </>
    )
  }
}
