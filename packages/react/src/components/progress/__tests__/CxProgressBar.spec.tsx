import * as React from 'react'
import { render } from '@testing-library/react'

import { CxProgressBar } from '../../../index'

test('loads and displays CxProgressBar component', async () => {
  const { container } = render(<CxProgressBar context="warning">Test</CxProgressBar>)
  expect(container).toMatchSnapshot()
})

test('CxProgressBar customize', async () => {
  const { container } = render(
    <CxProgressBar context="warning" className="bazinga" animated={true} value={50} variant="striped">
      Test
    </CxProgressBar>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('progress-bar')

  expect(container.firstChild).toHaveClass('warning')
  expect(container.firstChild).toHaveClass('progress-bar-striped')
  expect(container.firstChild).toHaveClass('progress-bar-animated')
  expect(container.firstChild).toHaveStyle(`width: 50%`)
})
