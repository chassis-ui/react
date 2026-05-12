import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxCloseButton } from '../../../index'

test('loads and displays CxCloseButton component', async () => {
  const { container } = render(<CxCloseButton>Test</CxCloseButton>)
  expect(container).toMatchSnapshot()
})

test('CxCloseButton customize', async () => {
  const { container } = render(
    <CxCloseButton white={true} disabled={true} className="bazinga">
      Test
    </CxCloseButton>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('close-button')
  expect(container.firstChild).toHaveClass('white')
  expect(container.firstChild).toHaveAttribute('disabled')
})
