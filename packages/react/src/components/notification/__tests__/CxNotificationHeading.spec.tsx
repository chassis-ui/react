import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxNotificationHeading } from '../../../index'

test('loads and displays CxNotificationHeading component', async () => {
  const { container } = render(<CxNotificationHeading>Test</CxNotificationHeading>)
  expect(container).toMatchSnapshot()
})

test('CxNotificationHeading customize', async () => {
  const { container } = render(
    <CxNotificationHeading component="h3" className="bazinga">
      Test
    </CxNotificationHeading>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('notification-heading')
})
