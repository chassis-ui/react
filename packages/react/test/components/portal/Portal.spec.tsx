import * as React from 'react'
import { render, screen, within } from '@testing-library/react'

import { Portal, useHydrated } from '../../../src/index'

describe('Portal', () => {
  test('renders its children into document.body in a client-only render', () => {
    const { container } = render(
      <Portal fallback={<span>Loading</span>}>
        <div>Portaled</div>
      </Portal>
    )
    expect(document.body).toContainElement(screen.getByText('Portaled'))
    expect(within(container).queryByText('Portaled')).toBeNull()
    expect(screen.queryByText('Loading')).toBeNull()
  })

  test('renders its children into the given container', () => {
    const target = document.createElement('section')
    document.body.appendChild(target)
    render(
      <Portal container={target}>
        <div>Portaled</div>
      </Portal>
    )
    expect(within(target).getByText('Portaled')).toBeInTheDocument()
    target.remove()
  })
})

describe('useHydrated', () => {
  const Probe = () => <p>{useHydrated() ? 'Hydrated' : 'Server'}</p>

  test('is true from the first client-only render', () => {
    render(<Probe />)
    expect(screen.getByText('Hydrated')).toBeInTheDocument()
  })
})
