import * as React from 'react'
import { render } from '@testing-library/react'

import { CxCardImage } from '../../../index'

test('loads and displays CxCardImage component', async () => {
  const { container } = render(<CxCardImage />)
  expect(container).toMatchSnapshot()
})

test('CxCardImage customize', async () => {
  const { container } = render(
    <CxCardImage className="bazinga" component="div" orientation="bottom" />,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('card-image-bottom')
})
