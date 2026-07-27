import * as React from 'react'
import { render } from '@testing-library/react'

import { CxPlaceholder } from '../../../index'

test('loads and displays CxPlaceholder component', async () => {
  const { container } = render(<CxPlaceholder context="primary" />)
  expect(container).toMatchSnapshot()
})

test('CxPlaceholder customize', async () => {
  const { container } = render(
    <CxPlaceholder animation="glow" className="bazinga" context="secondary" size="large" sm={7} />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('bg-secondary')
  expect(container.firstChild).toHaveClass('small:col-7')
  expect(container.firstChild).toHaveClass('placeholder-large')
  expect(container.firstChild).toHaveClass('placeholder-glow')
})
