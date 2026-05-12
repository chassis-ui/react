import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCloseButton } from '../../../index'

test('loads and displays CxCloseButton component', async () => {
  const { container } = render(<CxCloseButton />)
  const button = document.querySelector('button')
  expect(button).toHaveClass('close-button')
  expect(button).toHaveAttribute('aria-label', 'Close')
  expect(container).toMatchSnapshot()
})

test('CxCloseButton customize', async () => {
  const { container } = render(<CxCloseButton white={true} disabled={true} className="bazinga" />)
  const button = document.querySelector('button')
  expect(button).toHaveClass('close-button')
  expect(button).toHaveClass('white')
  expect(button).toHaveClass('bazinga')
  expect(button).toHaveAttribute('aria-label', 'Close')
  expect(container).toMatchSnapshot()
})
