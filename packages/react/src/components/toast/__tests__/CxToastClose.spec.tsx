import * as React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { CxToastClose } from '../../../index'
import { CxToastContext } from '../CxToast'

test('CxToastClose closes the toast on click', async () => {
  const setVisible = jest.fn()
  const { container } = render(
    <CxToastContext.Provider value={{ setVisible }}>
      <CxToastClose />
    </CxToastContext.Provider>
  )
  fireEvent.click(container.firstChild as HTMLElement)
  expect(setVisible).toHaveBeenCalledWith(false)
})

test('CxToastClose still closes the toast when a custom onClick is provided', async () => {
  const setVisible = jest.fn()
  const onClick = jest.fn()
  const { container } = render(
    <CxToastContext.Provider value={{ setVisible }}>
      <CxToastClose onClick={onClick} />
    </CxToastContext.Provider>
  )
  fireEvent.click(container.firstChild as HTMLElement)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(setVisible).toHaveBeenCalledWith(false)
})
