import * as React from 'react'
import { render } from '@testing-library/react'

import { CxMenuDivider } from '../../../index'

test('loads and displays CxMenuDivider component', async () => {
  const { container } = render(<CxMenuDivider />)
  expect(container).toMatchSnapshot()
  expect(container.querySelector('hr')).toHaveClass('menu-divider')
})

test('CxMenuDivider customize', async () => {
  const { container } = render(<CxMenuDivider className="bazinga" />)
  expect(container.firstChild).toHaveClass('bazinga')
})
