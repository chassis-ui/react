import * as React from 'react'
import { render } from '@testing-library/react'

import { TabsTab } from '../../../src/index'

describe('TabsTab', () => {
  describe('rendering', () => {
    test('renders nothing itself - it is read as data by Tabs, not mounted directly', () => {
      const { container } = render(<TabsTab id="home">Home</TabsTab>)
      expect(container).toBeEmptyDOMElement()
    })

    test('renders nothing regardless of the disabled prop', () => {
      const { container } = render(
        <TabsTab id="home" disabled>
          Home
        </TabsTab>
      )
      expect(container).toBeEmptyDOMElement()
    })
  })
})
