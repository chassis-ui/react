import * as React from 'react'
import { render } from '@testing-library/react'

import { AutocompleteGroup, AutocompleteItem } from '../../../src/index'

// `AutocompleteGroup`/`AutocompleteItem` are never actually mounted in real usage — `Autocomplete`
// reads their props as data instead of rendering them (see each component's own file comment) —
// but they're still real components with a public contract: rendering either directly must not
// throw and must produce no output.
describe('AutocompleteGroup', () => {
  test('renders nothing when mounted directly', () => {
    const { container } = render(
      <AutocompleteGroup label="Frontend">
        <AutocompleteItem id="html">HTML</AutocompleteItem>
      </AutocompleteGroup>
    )
    expect(container).toBeEmptyDOMElement()
  })
})

describe('AutocompleteItem', () => {
  test('renders nothing when mounted directly', () => {
    const { container } = render(<AutocompleteItem id="apple">Apple</AutocompleteItem>)
    expect(container).toBeEmptyDOMElement()
  })
})
