import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxImage } from '../../../index'

test('loads and displays CxImage component', async () => {
  const { container } = render(<CxImage />)
  expect(container).toMatchSnapshot()
})

test('CxImage customize one', async () => {
  const { container } = render(<CxImage align="end" />)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('float-end')
})

test('CxImage customize two', async () => {
  const { container } = render(
    <CxImage className="bazinga" align="center" fluid={true} rounded={true} thumbnail={true} />,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('d-block')
  expect(container.firstChild).toHaveClass('mx-auto')
  expect(container.firstChild).toHaveClass('img-fluid')
  expect(container.firstChild).toHaveClass('rounded')
  expect(container.firstChild).toHaveClass('img-thumbnail')
  expect(container.firstChild).toHaveClass('bazinga')
})
