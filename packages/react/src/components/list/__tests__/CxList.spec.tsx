import * as React from 'react'
import { render } from '@testing-library/react'

import { CxList, CxListItem } from '../../../index'

test('loads and displays CxList component', async () => {
  const { container } = render(<CxList>Test</CxList>)
  expect(container).toMatchSnapshot()
})

test('CxList customize', async () => {
  const { container } = render(
    <CxList className="bazinga" component="h3" flush={true} layout="xlarge:horizontal">
      Test
    </CxList>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('list')
  expect(container.firstChild).toHaveClass('flush')
  expect(container.firstChild).toHaveClass('xlarge:horizontal')
})

test('CxList plain and numbered', async () => {
  const { container } = render(
    <CxList component="ol" plain={true} numbered={true}>
      Test
    </CxList>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('plain')
  expect(container.firstChild).toHaveClass('numbered')
})

test('CxList context and style', async () => {
  const { container } = render(
    <CxList context="primary" variant="solid">
      Test
    </CxList>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('context')
  expect(container.firstChild).toHaveClass('primary')
  expect(container.firstChild).toHaveClass('solid')
})

test('CxList example', async () => {
  const { container } = render(
    <CxList>
      <CxListItem>A</CxListItem>
      <CxListItem>B</CxListItem>
      <CxListItem>C</CxListItem>
    </CxList>
  )
  expect(container).toMatchSnapshot()
})

test('CxList forwards arbitrary HTML attributes and ref', async () => {
  const ref = React.createRef<HTMLUListElement>()
  const { container } = render(
    <CxList ref={ref} id="nav-list" data-testid="my-list">
      Test
    </CxList>
  )
  expect(ref.current).toBeInstanceOf(HTMLUListElement)
  expect(container.firstChild).toHaveAttribute('id', 'nav-list')
  expect(container.firstChild).toHaveAttribute('data-testid', 'my-list')
})

test('CxList data-driven items', async () => {
  const { container } = render(
    <CxList
      items={[
        { label: 'Dashboard', href: '#', active: true },
        { label: 'Profile', href: '#' },
        { label: 'Billing', href: '#', disabled: true, context: 'warning' }
      ]}
    />
  )
  expect(container).toMatchSnapshot()
})
