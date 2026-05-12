import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { getByText } from '@testing-library/dom'

import { CxCarousel, CxCarouselCaption, CxCarouselItem } from '../../../index'

test('loads and displays CxCarousel component', async () => {
  const { container } = render(
    <CxCarousel controls indicators>
      <CxCarouselItem>
        Item-1
        <CxCarouselCaption>Caption-1</CxCarouselCaption>
      </CxCarouselItem>
      <CxCarouselItem>
        Item-2
        <CxCarouselCaption>Caption-2</CxCarouselCaption>
      </CxCarouselItem>
      <CxCarouselItem>
        Item-3
        <CxCarouselCaption>Caption-3</CxCarouselCaption>
      </CxCarouselItem>
    </CxCarousel>,
  )

  const carousel = document.querySelector('.carousel')
  expect(carousel).toHaveClass('slide')
  if (carousel === null) {
    expect(true).toBe(false)
  } else {
    expect(carousel.children[0]).toHaveClass('carousel-indicators')
    expect(carousel.children[1]).toHaveClass('carousel-inner')
  }

  let caption = getByText(container, 'Caption-1')
  expect(caption).toHaveClass('carousel-caption')
  caption = getByText(container, 'Caption-2')
  expect(caption).toHaveClass('carousel-caption')
  caption = getByText(container, 'Caption-3')
  expect(caption).toHaveClass('carousel-caption')
  let item = getByText(container, 'Item-1')
  expect(item).toHaveClass('carousel-item')
  item = getByText(container, 'Item-2')
  expect(item).toHaveClass('carousel-item')
  item = getByText(container, 'Item-3')
  expect(item).toHaveClass('carousel-item')

  let button = document.querySelector('.carousel-control-next')
  if (button === null) {
    expect(true).toBe(false)
  } else {
    expect(button.firstChild).toHaveClass('carousel-control-next-icon')
  }
  button = document.querySelector('.carousel-control-prev')
  if (button === null) {
    expect(true).toBe(false)
  } else {
    expect(button.firstChild).toHaveClass('carousel-control-prev-icon')
  }

  expect(container).toMatchSnapshot()
})

test('CxCarousel click on indicator', async () => {
  const { container } = render(
    <CxCarousel controls indicators>
      <CxCarouselItem>
        Item-1
        <CxCarouselCaption>Caption-1</CxCarouselCaption>
      </CxCarouselItem>
      <CxCarouselItem>
        Item-2
        <CxCarouselCaption>Caption-2</CxCarouselCaption>
      </CxCarouselItem>
      <CxCarouselItem>
        Item-3
        <CxCarouselCaption>Caption-3</CxCarouselCaption>
      </CxCarouselItem>
    </CxCarousel>,
  )
  const item1 = getByText(container, 'Item-1')
  const item2 = getByText(container, 'Item-2')

  expect(item1).toHaveClass('active')
  expect(item1).toHaveClass('carousel-item')
  expect(item2).not.toHaveClass('active')
  expect(item2).toHaveClass('carousel-item')

  // click
  const buttons = document.querySelectorAll('.carousel-indicator-button')
  buttons[1] && fireEvent.click(buttons[1])
  fireEvent.transitionEnd(item1)
  fireEvent.transitionEnd(item2)

  expect(item1).not.toHaveClass('active')
  expect(item2).toHaveClass('active')

  // goback-click
  buttons[0] && fireEvent.click(buttons[0])
  fireEvent.transitionEnd(item1)
  fireEvent.transitionEnd(item2)

  expect(item1).toHaveClass('active')
  expect(item2).not.toHaveClass('active')
})

test('CxCarousel click on button', async () => {
  jest.useFakeTimers()
  const { container } = render(
    <CxCarousel controls indicators>
      <CxCarouselItem>
        Item-1
        <CxCarouselCaption>Caption-1</CxCarouselCaption>
      </CxCarouselItem>
      <CxCarouselItem>
        Item-2
        <CxCarouselCaption>Caption-2</CxCarouselCaption>
      </CxCarouselItem>
      <CxCarouselItem>
        Item-3
        <CxCarouselCaption>Caption-3</CxCarouselCaption>
      </CxCarouselItem>
    </CxCarousel>,
  )
  const item1 = getByText(container, 'Item-1')
  const item2 = getByText(container, 'Item-2')

  expect(item1).toHaveClass('active')
  expect(item1).toHaveClass('carousel-item')
  expect(item2).not.toHaveClass('active')
  expect(item2).toHaveClass('carousel-item')

  // click
  const buttonNext = document.querySelector('.carousel-control-next')
  buttonNext && fireEvent.click(buttonNext)
  fireEvent.transitionEnd(item1)
  fireEvent.transitionEnd(item2)

  expect(item1).not.toHaveClass('active')
  expect(item2).toHaveClass('active')

  // goback-click
  const buttonPrev = document.querySelector('.carousel-control-prev')
  buttonPrev && fireEvent.click(buttonPrev)
  fireEvent.transitionEnd(item1)
  fireEvent.transitionEnd(item2)

  expect(item1).toHaveClass('active')
  expect(item2).not.toHaveClass('active')
})
