import React, { Ref } from 'react'
import { render } from '@testing-library/react'

import { useForkedRef } from '../../src/hooks/useForkedRef'
import { assignRef, AssignableRef, isFunction } from '../../src/hooks/useForkedRef'

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

function CallbackProbe({
  refA,
  refB
}: {
  refA?: AssignableRef<HTMLDivElement>
  refB?: AssignableRef<HTMLDivElement>
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

  // React 19: a callback ref may return a cleanup, which React runs in place of a call with
  // `null`. The forked ref used to drop it and call the callback with `null` instead.
  test("runs a callback ref's cleanup on unmount, and doesn't call it with null", () => {
    const cleanup = vi.fn()
    const callback = vi.fn((_node: HTMLDivElement | null) => cleanup)
    const objectRef = React.createRef<HTMLDivElement>()
    const { unmount } = render(<CallbackProbe refA={callback} refB={objectRef} />)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenLastCalledWith(expect.any(HTMLDivElement))
    expect(cleanup).not.toHaveBeenCalled()

    unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledTimes(1)
    // The object ref beside it is still reset.
    expect(objectRef.current).toBeNull()
  })

  test('calls a callback ref that returns no cleanup with null on unmount', () => {
    const callback = vi.fn((_node: HTMLDivElement | null) => undefined)
    const { unmount } = render(<CallbackProbe refA={callback} />)
    unmount()
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith(null)
  })

  test('cleans up the old ref and attaches the new one when a ref changes', () => {
    const firstCleanup = vi.fn()
    const first = vi.fn((_node: HTMLDivElement | null) => firstCleanup)
    const second = vi.fn((_node: HTMLDivElement | null) => undefined)
    const { rerender } = render(<CallbackProbe refA={first} />)
    rerender(<CallbackProbe refA={second} />)
    expect(firstCleanup).toHaveBeenCalledTimes(1)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenLastCalledWith(expect.any(HTMLDivElement))
  })

  test('a forked ref nested in another passes its cleanup up', () => {
    const cleanup = vi.fn()
    const callback = vi.fn((_node: HTMLDivElement | null) => cleanup)
    function Inner({ innerRef }: { innerRef: Ref<HTMLDivElement> }) {
      const forkedRef = useForkedRef(innerRef, null)
      return <div ref={forkedRef} />
    }
    function Outer() {
      const forkedRef = useForkedRef<HTMLDivElement>(callback, null)
      return <Inner innerRef={forkedRef} />
    }
    const { unmount } = render(<Outer />)
    unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('calls an async callback ref', () => {
    const calls: (HTMLDivElement | null)[] = []
    const callback = async (node: HTMLDivElement | null) => {
      calls.push(node)
    }
    const { unmount } = render(<CallbackProbe refA={callback} />)
    expect(calls).toEqual([expect.any(HTMLDivElement)])
    unmount()
    expect(calls).toEqual([expect.any(HTMLDivElement), null])
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

  test('returns the cleanup a callback ref returned, and nothing otherwise', () => {
    const cleanup = () => {}
    expect(assignRef(() => cleanup, 'node')).toBe(cleanup)
    expect(assignRef(() => undefined, 'node')).toBeUndefined()
    expect(assignRef({ current: null }, 'node')).toBeUndefined()
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
    expect(isFunction(async () => {})).toBe(true)
    expect(isFunction(function* () {})).toBe(true)
  })

  test('rejects non-function values', () => {
    expect(isFunction(null)).toBe(false)
    expect(isFunction({})).toBe(false)
    expect(isFunction('fn')).toBe(false)
  })
})
