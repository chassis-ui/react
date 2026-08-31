import React from 'react'
import { render } from '@testing-library/react'

import { useForkedRef } from '../../src/hooks/useForkedRef'
import { assignRef, isFunction } from '../../src/hooks/useForkedRef'

function ForkedRefProbe({
  refA,
  refB
}: {
  refA?: React.MutableRefObject<HTMLDivElement | null> | null
  refB?: React.MutableRefObject<HTMLDivElement | null> | null
}) {
  const forkedRef = useForkedRef(refA, refB)
  return <div ref={forkedRef} />
}

describe('useForkedRef', () => {
  test('assigns the node to every non-null ref', () => {
    const refA = React.createRef<HTMLDivElement>()
    const refB = React.createRef<HTMLDivElement>()
    render(<ForkedRefProbe refA={refA} refB={refB} />)
    expect(refA.current).toBeInstanceOf(HTMLDivElement)
    expect(refB.current).toBe(refA.current)
  })

  test('returns null when every ref is null or undefined', () => {
    expect(() => render(<ForkedRefProbe refA={null} refB={undefined} />)).not.toThrow()
  })
})

describe('assignRef', () => {
  test('is a no-op for a null or undefined ref', () => {
    expect(() => assignRef(null, {})).not.toThrow()
    expect(() => assignRef(undefined, {})).not.toThrow()
  })

  test('calls a callback ref with the value', () => {
    const callback = vi.fn()
    assignRef(callback, 'node')
    expect(callback).toHaveBeenCalledWith('node')
  })

  test('sets .current on an object ref', () => {
    const ref = { current: null } as React.MutableRefObject<unknown>
    assignRef(ref, 'node')
    expect(ref.current).toBe('node')
  })

  test('wraps an assignment failure in a descriptive error', () => {
    const ref = {} as React.MutableRefObject<unknown>
    Object.defineProperty(ref, 'current', {
      set() {
        throw new Error('boom')
      }
    })
    expect(() => assignRef(ref, 'node')).toThrow('Cannot assign value "node" to ref')
  })
})

describe('isFunction', () => {
  test('identifies functions', () => {
    expect(isFunction(() => {})).toBe(true)
  })

  test('rejects non-function values', () => {
    expect(isFunction(null)).toBe(false)
    expect(isFunction({})).toBe(false)
    expect(isFunction('fn')).toBe(false)
  })
})
