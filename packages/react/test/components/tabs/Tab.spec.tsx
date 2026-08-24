import * as React from 'react'
import { render } from '@testing-library/react'

import { Tab } from '../../../src/index'

describe('Tab', () => {
  describe('rendering', () => {
    test('renders nothing itself - it is read as data by Tabs, not mounted directly', () => {
      const { container } = render(<Tab id="home">Home</Tab>)
      expect(container).toBeEmptyDOMElement()
    })

    test('renders nothing regardless of the disabled prop', () => {
      const { container } = render(
        <Tab id="home" disabled>
          Home
        </Tab>
      )
      expect(container).toBeEmptyDOMElement()
    })
  })
})
