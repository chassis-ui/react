import * as React from 'react'
import { render } from '@testing-library/react'

import { CxButtonToolbar, CxButtonGroup, CxButton } from '../../../index'

test('loads and displays CxButtonToolbar component', async () => {
  const { container } = render(<CxButtonToolbar></CxButtonToolbar>)
  expect(container).toMatchSnapshot()
})

test('CxButtonToolbar customize', async () => {
  const { container } = render(
    <CxButtonToolbar className="bazinga" role="group" aria-label="Bazinga">
      <CxButtonGroup role="group">
        <CxButton>1</CxButton>
        <CxButton>2</CxButton>
        <CxButton>3</CxButton>
      </CxButtonGroup>
      <CxButtonGroup role="group">
        <CxButton>A</CxButton>
        <CxButton>B</CxButton>
        <CxButton>C</CxButton>
      </CxButtonGroup>
    </CxButtonToolbar>
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('button-toolbar')
})
