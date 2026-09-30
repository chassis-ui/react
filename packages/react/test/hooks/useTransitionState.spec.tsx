import React, { act, StrictMode, useRef } from 'react'
import { render, screen } from '@testing-library/react'

import { useTransitionState, UseTransitionStateOptions } from '../../src/hooks/useTransitionState'

type ProbeProps = Omit<UseTransitionStateOptions, 'nodeRef'> & { withoutNode?: boolean }

// Renders the phase as the element's text and class, the way a component would.
function Probe({ withoutNode, ...options }: ProbeProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const { isMounted, phase } = useTransitionState({ ...options, nodeRef })
  if (!isMounted || withoutNode) return <span>no element, {phase}</span>
  return (
    <div ref={nodeRef} role="status" className={phase}>
      {phase}
    </div>
  )
}

// Every class the element had, in order, up to the one it has now.
function recordClasses() {
  const observer = new MutationObserver(() => undefined)
  observer.observe(document.body, {
    attributeFilter: ['class'],
    attributeOldValue: true,
    subtree: true
  })
  return (element: HTMLElement) => [
    ...observer
      .takeRecords()
      .filter((record) => record.target === element)
      .map((record) => record.oldValue),
    element.className
  ]
}

describe('useTransitionState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('first render', () => {
    test('shown starts settled', () => {
      const onEnter = vi.fn()
      render(<Probe in onEnter={onEnter} />)
      expect(screen.getByRole('status')).toHaveTextContent('entered')
      expect(onEnter).not.toHaveBeenCalled()
    })

    test('hidden starts exited, in the DOM', () => {
      render(<Probe in={false} />)
      expect(screen.getByRole('status')).toHaveTextContent('exited')
    })

    test.each([['mountOnEnter'], ['unmountOnExit']])('hidden with %s renders nothing', (option) => {
      render(<Probe in={false} {...{ [option]: true }} />)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      expect(screen.getByText('no element, unmounted')).toBeInTheDocument()
    })

    test('shown with appear enters from the hidden state', () => {
      const classes = recordClasses()
      render(<Probe in appear />)
      const element = screen.getByRole('status')
      expect(classes(element)).toEqual(['exited', 'entering'])
      act(() => vi.runAllTimers())
      expect(element).toHaveTextContent('entered')
    })
  })

  describe('entering', () => {
    test('mounts hidden, then enters, then settles', () => {
      const classes = recordClasses()
      const { rerender } = render(<Probe in={false} mountOnEnter unmountOnExit />)
      rerender(<Probe in mountOnEnter unmountOnExit />)
      const element = screen.getByRole('status')
      expect(classes(element)).toEqual(['exited', 'entering'])
      act(() => vi.runAllTimers())
      expect(element).toHaveTextContent('entered')
    })

    test('fires onEnter, onEntering and onEntered in that order', () => {
      const calls: string[] = []
      const callbacks = {
        onEnter: () => calls.push('onEnter'),
        onEntering: () => calls.push('onEntering'),
        onEntered: () => calls.push('onEntered')
      }
      const { rerender } = render(<Probe in={false} {...callbacks} />)
      rerender(<Probe in {...callbacks} />)
      expect(calls).toEqual(['onEnter', 'onEntering'])
      act(() => vi.runAllTimers())
      expect(calls).toEqual(['onEnter', 'onEntering', 'onEntered'])
    })

    test('ends on the element’s transitionend, without waiting for the timer', () => {
      const { rerender } = render(<Probe in={false} />)
      rerender(<Probe in />)
      const element = screen.getByRole('status')
      expect(element).toHaveTextContent('entering')
      act(() => {
        element.dispatchEvent(new Event('transitionend'))
      })
      expect(element).toHaveTextContent('entered')
    })

    test('lasts as long as the element’s own transition', () => {
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        transitionDuration: '0.3s',
        transitionDelay: '0s'
      } as CSSStyleDeclaration)
      const { rerender } = render(<Probe in={false} />)
      rerender(<Probe in />)
      act(() => vi.advanceTimersByTime(300))
      expect(screen.getByRole('status')).toHaveTextContent('entering')
      act(() => vi.advanceTimersByTime(50))
      expect(screen.getByRole('status')).toHaveTextContent('entered')
      vi.restoreAllMocks()
    })

    test('starts once under StrictMode', () => {
      const onEnter = vi.fn()
      render(
        <StrictMode>
          <Probe in appear onEnter={onEnter} />
        </StrictMode>
      )
      expect(onEnter).toHaveBeenCalledTimes(1)
      act(() => vi.runAllTimers())
      expect(screen.getByRole('status')).toHaveTextContent('entered')
    })
  })

  describe('exiting', () => {
    test('fires onExit, onExiting and onExited in that order, and stays in the DOM', () => {
      const calls: string[] = []
      const callbacks = {
        onExit: () => calls.push('onExit'),
        onExiting: () => calls.push('onExiting'),
        onExited: () => calls.push('onExited')
      }
      const { rerender } = render(<Probe in {...callbacks} />)
      rerender(<Probe in={false} {...callbacks} />)
      expect(screen.getByRole('status')).toHaveTextContent('exiting')
      expect(calls).toEqual(['onExit', 'onExiting'])
      act(() => vi.runAllTimers())
      expect(calls).toEqual(['onExit', 'onExiting', 'onExited'])
      expect(screen.getByRole('status')).toHaveTextContent('exited')
    })

    test('unmountOnExit takes the element out once exited, after onExited has seen it', () => {
      let presentAtExited = false
      const onExited = () => {
        presentAtExited = screen.queryByRole('status') !== null
      }
      const { rerender } = render(<Probe in unmountOnExit onExited={onExited} />)
      rerender(<Probe in={false} unmountOnExit onExited={onExited} />)
      expect(screen.getByRole('status')).toHaveTextContent('exiting')
      act(() => vi.runAllTimers())
      expect(presentAtExited).toBe(true)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    test('ends at once when there is no element to wait on', () => {
      const onExited = vi.fn()
      const { rerender } = render(<Probe in unmountOnExit onExited={onExited} />)
      rerender(<Probe in={false} unmountOnExit withoutNode onExited={onExited} />)
      expect(onExited).toHaveBeenCalledTimes(1)
      expect(screen.getByText('no element, unmounted')).toBeInTheDocument()
    })
  })

  describe('interrupted', () => {
    test('hidden while entering exits from there, and never reports entered', () => {
      const onEntered = vi.fn()
      const onExited = vi.fn()
      const { rerender } = render(<Probe in={false} onEntered={onEntered} onExited={onExited} />)
      rerender(<Probe in onEntered={onEntered} onExited={onExited} />)
      rerender(<Probe in={false} onEntered={onEntered} onExited={onExited} />)
      expect(screen.getByRole('status')).toHaveTextContent('exiting')
      act(() => vi.runAllTimers())
      expect(screen.getByRole('status')).toHaveTextContent('exited')
      expect(onEntered).not.toHaveBeenCalled()
      expect(onExited).toHaveBeenCalledTimes(1)
    })

    test('shown while exiting enters again, without leaving the DOM', () => {
      const onExited = vi.fn()
      const { rerender } = render(<Probe in unmountOnExit onExited={onExited} />)
      const element = screen.getByRole('status')
      rerender(<Probe in={false} unmountOnExit onExited={onExited} />)
      rerender(<Probe in unmountOnExit onExited={onExited} />)
      expect(element).toHaveTextContent('entering')
      act(() => vi.runAllTimers())
      expect(screen.getByRole('status')).toBe(element)
      expect(element).toHaveTextContent('entered')
      expect(onExited).not.toHaveBeenCalled()
    })
  })

  test('calls the callbacks of the latest render', () => {
    const first = vi.fn()
    const latest = vi.fn()
    const { rerender } = render(<Probe in={false} onEntered={first} />)
    rerender(<Probe in onEntered={first} />)
    rerender(<Probe in onEntered={latest} />)
    act(() => vi.runAllTimers())
    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledTimes(1)
  })
})
