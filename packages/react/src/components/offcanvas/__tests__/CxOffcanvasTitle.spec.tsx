import * as React from 'react'
import { render } from '@testing-library/react'

import { CxOffcanvasTitle } from '../../../index'

test('loads and displays CxOffcanvasTitle component', async () => {
  const { container } = render(<CxOffcanvasTitle />)
  expect(container).toMatchSnapshot()
})

test('CxOffcanvasTitle customize', async () => {
  const { container } = render(
    <CxOffcanvasTitle className="bazinga" component="div">
      Test
    </CxOffcanvasTitle>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('offcanvas-title')
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveTextContent('Test')
})
