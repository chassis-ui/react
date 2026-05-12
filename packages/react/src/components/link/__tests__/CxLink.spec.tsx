import * as React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { CxLink } from '../../../index'

test('loads and displays CxLink component', async () => {
  const { container } = render(<CxLink>Test</CxLink>)
  expect(container).toMatchSnapshot()
})

test('CxLink customize', async () => {
  const { container } = render(
    <CxLink className="bazinga" active={true} component="button" disabled type="submit">
      Test
    </CxLink>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('active')
  expect(container.firstChild).toHaveAttribute('disabled')
})

test('CxLink click on button', async () => {
  const onClick = jest.fn()
  render(
    <CxLink onClick={onClick} className="bazinga">
      Test
    </CxLink>,
  )
  expect(onClick).toHaveBeenCalledTimes(0)
  const link = document.querySelector('.bazinga')
  if (link !== null) {
    fireEvent.click(link)
  }
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('CxLink click on disabled button', async () => {
  const click = jest.fn()
  render(
    <CxLink onClick={click} className="bazinga" component="button" disabled>
      Test
    </CxLink>,
  )
  expect(click).toHaveBeenCalledTimes(0)
  const link = document.querySelector('.bazinga')
  if (link !== null) {
    fireEvent.click(link)
  }
  expect(click).toHaveBeenCalledTimes(0)
})
