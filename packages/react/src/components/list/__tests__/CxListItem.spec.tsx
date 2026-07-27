import * as React from 'react'
import { render } from '@testing-library/react'

import { CxListItem } from '../../../index'

test('loads and displays CxListItem component', async () => {
  const { container } = render(<CxListItem>Test</CxListItem>)
  expect(container).toMatchSnapshot()
})

test('CxListItem customize', async () => {
  const { container } = render(
    <CxListItem
      className="bazinga"
      active={true}
      context="warning"
      disabled={true}
      component="button"
    >
      Test
    </CxListItem>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('list-item')
  expect(container.firstChild).toHaveClass('list-action')
  expect(container.firstChild).toHaveClass('context')
  expect(container.firstChild).toHaveClass('warning')
  expect(container.firstChild).toHaveClass('active')
  expect(container.firstChild).toHaveClass('disabled')
})

test('CxListItem forwards ref for default li element', async () => {
  const ref = React.createRef<HTMLLIElement>()
  render(<CxListItem ref={ref}>Test</CxListItem>)
  expect(ref.current).toBeInstanceOf(HTMLLIElement)
})
