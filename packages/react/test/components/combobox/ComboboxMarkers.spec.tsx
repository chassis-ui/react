import * as React from 'react'
import { render } from '@testing-library/react'

import { ComboboxGroup, ComboboxItem } from '../../../src/index'

// `ComboboxGroup`/`ComboboxItem` are never actually mounted in real usage — `Combobox` reads
// their props as data instead of rendering them (see each component's own file comment) — but
// they're still real components with a public contract: rendering either directly must not throw
// and must produce no output.
describe('ComboboxGroup', () => {
  test('renders nothing when mounted directly', () => {
    const { container } = render(
      <ComboboxGroup label="Frontend">
        <ComboboxItem id="html">HTML</ComboboxItem>
      </ComboboxGroup>
    )
    expect(container).toBeEmptyDOMElement()
  })
})

describe('ComboboxItem', () => {
  test('renders nothing when mounted directly', () => {
    const { container } = render(<ComboboxItem id="apple">Apple</ComboboxItem>)
    expect(container).toBeEmptyDOMElement()
  })
})
