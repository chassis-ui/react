import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { CxMenuText } from '../../../index'

test('loads and displays CxMenuText component', async () => {
  const { container } = render(<CxMenuText>Test</CxMenuText>)
  expect(container).toMatchSnapshot()
  expect(screen.getByText('Test')).toHaveClass('menu-text')
})

test('CxMenuText customize', async () => {
  render(
    <CxMenuText component="p" className="bazinga">
      Test
    </CxMenuText>,
  )
  const text = screen.getByText('Test')
  expect(text).toHaveClass('bazinga')
  expect(text.tagName).toBe('P')
})
