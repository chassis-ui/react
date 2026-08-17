import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { useSuppressFocusRingOnPointerDown } from '../../src/hooks/useSuppressFocusRingOnPointerDown'

const TestButton = () => {
  const suppressFocusRing = useSuppressFocusRingOnPointerDown<HTMLButtonElement>()
  return (
    <button onPointerDown={suppressFocusRing} style={{ outline: '2px solid red' }}>
      Press
    </button>
  )
}

describe('useSuppressFocusRingOnPointerDown', () => {
  test('suppresses the outline on pointerdown and restores it on blur', () => {
    render(<TestButton />)
    const button = screen.getByRole('button')

    fireEvent.pointerDown(button)
    expect(button.style.outline).toBe('none')

    fireEvent.blur(button)
    expect(button.style.outline).toBe('2px solid red')
  })

  test('guards against a repeated pointerdown before blur overwriting the saved outline', () => {
    render(<TestButton />)
    const button = screen.getByRole('button')

    fireEvent.pointerDown(button)
    fireEvent.pointerDown(button)
    fireEvent.blur(button)

    expect(button.style.outline).toBe('2px solid red')
  })
})
