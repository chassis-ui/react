import * as React from 'react'
import { render } from '@testing-library/react'

import { CxNotificationLink } from '../../../index'

test('loads and displays CxNotificationLink component', async () => {
  const { container } = render(<CxNotificationLink>Test</CxNotificationLink>)
  expect(container).toMatchSnapshot()
})

test('CxNotificationLink customize', async () => {
  const { container } = render(
    <CxNotificationLink className="bazinga" href="/bazinga">
      Test
    </CxNotificationLink>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('notification-link')
})
