import * as React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'

import {
  Autocomplete,
  AutocompleteItem,
  Combobox,
  ComboboxItem,
  ContextMenu,
  Menu,
  MenuItem,
  MenuList,
  MenuSubmenu,
  MenuToggle
} from '../../src/index'

// react-aria's `useOverlayPosition` writes the room it finds for an overlay as an inline
// `max-height` on the element, which outranks chassis-css's `--cx-menu-max-height` on `.menu`. The
// panels of these components take only their position from it (`useOverlayMaxHeight`).
//
// The `.menu` wrapper of a combobox's list has no role of its own (`Combobox.spec.tsx`).
const comboboxPanel = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.menu') as HTMLElement

const resize = async () => {
  await act(async () => {
    window.dispatchEvent(new Event('resize'))
  })
}

describe('useOverlayMaxHeight', () => {
  test("a Menu's list has no inline max-height, opened or placed again", async () => {
    render(
      <Menu visible>
        <MenuToggle>Menu</MenuToggle>
        <MenuList>
          <MenuItem>A</MenuItem>
        </MenuList>
      </Menu>
    )
    expect(screen.getByRole('menu').style.maxHeight).toBe('')
    await resize()
    expect(screen.getByRole('menu').style.maxHeight).toBe('')
  })

  test("a MenuSubmenu's panel has no inline max-height", () => {
    vi.useFakeTimers()
    render(
      <Menu visible>
        <MenuToggle>Menu</MenuToggle>
        <MenuList>
          <MenuSubmenu activation="click" trigger="More">
            <MenuItem>Nested</MenuItem>
          </MenuSubmenu>
        </MenuList>
      </Menu>
    )
    fireEvent.click(screen.getByRole('menuitem', { name: 'More' }))
    act(() => vi.runAllTimers())
    const panel = screen.getByRole('menu', { name: 'More' })
    expect(panel).toHaveClass('show')
    expect(panel.style.maxHeight).toBe('')
    vi.useRealTimers()
  })

  test("a ContextMenu's list has no inline max-height", () => {
    render(
      <ContextMenu visible>
        <span>Region</span>
        <MenuList>
          <MenuItem>Cut</MenuItem>
        </MenuList>
      </ContextMenu>
    )
    expect(screen.getByRole('menu').style.maxHeight).toBe('')
  })

  test("a Combobox's list keeps the theme's cap, with no inline max-height over it", async () => {
    render(
      <Combobox aria-label="Fruit">
        <ComboboxItem id="apple">Apple</ComboboxItem>
      </Combobox>
    )
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Fruit' }), { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(comboboxPanel().style.maxHeight).toBe('')
    expect(comboboxPanel().style.getPropertyValue('--cx-menu-max-height')).toBe('320px')
    await resize()
    expect(comboboxPanel().style.maxHeight).toBe('')
  })

  test("an Autocomplete's list has no inline max-height", () => {
    render(
      <Autocomplete aria-label="Fruit">
        <AutocompleteItem id="apple">Apple</AutocompleteItem>
      </Autocomplete>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
    expect(comboboxPanel().style.maxHeight).toBe('')
  })
})
