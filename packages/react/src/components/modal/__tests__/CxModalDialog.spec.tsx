import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CxModalDialog } from '../../../index'

test('loads and displays CxModalDialog component', async () => {
  const { container } = render(<CxModalDialog>Test</CxModalDialog>)
  expect(container).toMatchSnapshot()
})

test('CxModalDialog customize', async () => {
  const { container } = render(
    <CxModalDialog
      className="bazinga"
      alignment="center"
      fullscreen="large"
      scrollable={true}
      size="xlarge"
    >
      Test
    </CxModalDialog>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('modal-dialog')
  expect(container.firstChild).toHaveClass('modal-dialog-centered')
  expect(container.firstChild).toHaveClass('large:modal-fullscreen-down')
  expect(container.firstChild).toHaveClass('modal-dialog-scrollable')
  expect(container.firstChild).toHaveClass('modal-xlarge')
})
