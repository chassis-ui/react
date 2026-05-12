import * as React from 'react'
import { render } from '@testing-library/react'

import { CxRow } from '../../../index'

test('CxRow not-customize', async () => {
  const { container } = render(<CxRow>Test</CxRow>)
  expect(container).toMatchSnapshot()
})

test('CxRow customize cols', async () => {
  const { container } = render(
    <CxRow
      className="bazinga"
      xs={{ cols: 1 }}
      sm={{ cols: 2 }}
      md={{ cols: 3 }}
      lg={{ cols: 4 }}
      xl={{ cols: 5 }}
      xxl={{ cols: 6 }}
    >
      Test
    </CxRow>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('row-cols-1')
  expect(container.firstChild).toHaveClass('small:row-cols-2')
  expect(container.firstChild).toHaveClass('medium:row-cols-3')
  expect(container.firstChild).toHaveClass('large:row-cols-4')
  expect(container.firstChild).toHaveClass('xlarge:row-cols-5')
  expect(container.firstChild).toHaveClass('2xlarge:row-cols-6')
})

test('CxRow customize gutter single gutter', async () => {
  const { container } = render(
    <CxRow className="bazinga" xs={{ gutter: 7 }}>
      Test
    </CxRow>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('g-7')
})

test('CxRow customize gutter', async () => {
  const { container } = render(
    <CxRow
      className="bazinga"
      xs={{ gutter: 1 }}
      sm={{ gutter: 2 }}
      md={{ gutter: 3 }}
      lg={{ gutter: 4 }}
      xl={{ gutter: 5 }}
      xxl={{ gutter: 6 }}
    >
      Test
    </CxRow>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('g-1')
  expect(container.firstChild).toHaveClass('small:g-2')
  expect(container.firstChild).toHaveClass('medium:g-3')
  expect(container.firstChild).toHaveClass('large:g-4')
  expect(container.firstChild).toHaveClass('xlarge:g-5')
  expect(container.firstChild).toHaveClass('2xlarge:g-6')
})

test('CxRow customize gutterX', async () => {
  const { container } = render(
    <CxRow
      className="bazinga"
      xs={{ gutterX: 1 }}
      sm={{ gutterX: 2 }}
      md={{ gutterX: 3 }}
      lg={{ gutterX: 4 }}
      xl={{ gutterX: 5 }}
      xxl={{ gutterX: 6 }}
    >
      Test
    </CxRow>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('gx-1')
  expect(container.firstChild).toHaveClass('small:gx-2')
  expect(container.firstChild).toHaveClass('medium:gx-3')
  expect(container.firstChild).toHaveClass('large:gx-4')
  expect(container.firstChild).toHaveClass('xlarge:gx-5')
  expect(container.firstChild).toHaveClass('2xlarge:gx-6')
})

test('CxRow customize gutterY', async () => {
  const { container } = render(
    <CxRow
      className="bazinga"
      xs={{ gutterY: 1 }}
      sm={{ gutterY: 2 }}
      md={{ gutterY: 3 }}
      lg={{ gutterY: 4 }}
      xl={{ gutterY: 5 }}
      xxl={{ gutterY: 6 }}
    >
      Test
    </CxRow>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('gy-1')
  expect(container.firstChild).toHaveClass('small:gy-2')
  expect(container.firstChild).toHaveClass('medium:gy-3')
  expect(container.firstChild).toHaveClass('large:gy-4')
  expect(container.firstChild).toHaveClass('xlarge:gy-5')
  expect(container.firstChild).toHaveClass('2xlarge:gy-6')
})
