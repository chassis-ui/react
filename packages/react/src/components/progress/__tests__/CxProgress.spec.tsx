import * as React from 'react'
import { render } from '@testing-library/react'

import { CxProgress } from '../../../index'

test('loads and displays CxProgress component', async () => {
  const { container } = render(<CxProgress context="warning">Test</CxProgress>)
  expect(container).toMatchSnapshot()
})

test('CxProgress customize', async () => {
  const { container } = render(
    <CxProgress className="bazinga" height={100} context="warning" value={50}>
      Test
    </CxProgress>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('progress')
  expect(container.firstChild).toHaveStyle(`height: 100px`)
})
