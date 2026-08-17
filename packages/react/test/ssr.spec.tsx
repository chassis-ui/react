// @vitest-environment node
import * as React from 'react'
import { renderToString } from 'react-dom/server'

import {
  Drawer,
  DrawerBody,
  Menu,
  MenuItem,
  MenuList,
  MenuToggle,
  Modal,
  ModalBody
} from '../src/index'

// Runs under a real Node environment (no jsdom `window`/`document` globals) — the only way to
// actually exercise `useIsomorphicLayoutEffect`'s server branch, since jsdom always defines
// `window`. Guards against regressing back to a bare `useLayoutEffect`, which doesn't crash SSR
// but does log a console.error on every render ("useLayoutEffect does nothing on the server") —
// see Drawer/Menu/Modal, the three components that need it.
describe('SSR', () => {
  test('does not access window/document at module scope', () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
  })

  test('renderToString does not warn about useLayoutEffect for Modal, Drawer, or Menu', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    expect(() =>
      renderToString(
        <Modal visible>
          <ModalBody>Hello</ModalBody>
        </Modal>
      )
    ).not.toThrow()
    expect(() =>
      renderToString(
        <Drawer visible placement="end">
          <DrawerBody>Hello</DrawerBody>
        </Drawer>
      )
    ).not.toThrow()
    expect(() =>
      renderToString(
        <Menu>
          <MenuToggle>Toggle</MenuToggle>
          <MenuList>
            <MenuItem>Item</MenuItem>
          </MenuList>
        </Menu>
      )
    ).not.toThrow()

    const layoutEffectWarnings = consoleError.mock.calls.filter((args) =>
      String(args[0]).includes('useLayoutEffect does nothing on the server')
    )
    expect(layoutEffectWarnings).toHaveLength(0)
    consoleError.mockRestore()
  })
})
