import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import { Menu, MenuItem, MenuList, MenuToggle, Modal } from '../../src/index'
import { pushOverlay } from '../../src/utils/overlayStack'

const escape = () => fireEvent.keyDown(window, { key: 'Escape' })

describe('overlayStack', () => {
  // Regression test: overlays mounted open in one commit push from their effects, the inner one
  // first, so the modal around a menu went on top, and Escape was the modal's.
  test('a menu mounted open in a modal mounted open takes Escape first', () => {
    vi.useFakeTimers()
    render(
      <Modal instant visible>
        <Menu defaultVisible>
          <MenuToggle>Actions</MenuToggle>
          <MenuList>
            <MenuItem>Rename</MenuItem>
          </MenuList>
        </Menu>
      </Modal>
    )
    act(() => vi.runAllTimers())
    expect(screen.getByRole('menu')).toHaveClass('show')

    // Prevented, so the browser sends the modal no `cancel`.
    expect(escape()).toBe(false)
    act(() => vi.runAllTimers())
    expect(screen.getByRole('menu', { hidden: true })).not.toHaveClass('show')
    // With the menu closed, the key is the modal's.
    expect(escape()).toBe(true)
    vi.useRealTimers()
  })

  test('an overlay pushed with one already open inside it goes under that one', () => {
    const outer = document.createElement('div')
    const inner = document.createElement('div')
    outer.append(inner)
    document.body.append(outer)
    const onInner = vi.fn()
    const onOuter = vi.fn()

    const popInner = pushOverlay({ nodes: () => [inner], onEscape: onInner })
    const popOuter = pushOverlay({ nodes: () => [outer], onEscape: onOuter })
    escape()
    expect(onInner).toHaveBeenCalledTimes(1)
    expect(onOuter).not.toHaveBeenCalled()

    popInner()
    escape()
    expect(onOuter).toHaveBeenCalledTimes(1)
    popOuter()
    outer.remove()
  })

  test('an overlay pushed beside the open ones goes on top', () => {
    const first = document.createElement('div')
    const second = document.createElement('div')
    document.body.append(first, second)
    const onFirst = vi.fn()
    const onSecond = vi.fn()

    const popFirst = pushOverlay({ nodes: () => [first], onEscape: onFirst })
    const popSecond = pushOverlay({ nodes: () => [second], onEscape: onSecond })
    escape()
    expect(onSecond).toHaveBeenCalledTimes(1)
    expect(onFirst).not.toHaveBeenCalled()

    popSecond()
    popFirst()
    first.remove()
    second.remove()
  })
})
