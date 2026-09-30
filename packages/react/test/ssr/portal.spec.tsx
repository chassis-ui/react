// @vitest-environment node
import * as React from 'react'
import { renderToString } from 'react-dom/server'

import * as serverLibrary from '../../src/index'
import { installClientEnvironment } from './clientEnvironment'

// Portaled content, server-rendered and hydrated: it must hydrate without a mismatch and then
// actually appear, where it did before `Portal` (B1 of AUDIT-PLAN.md). The hydration sweep only
// proves the first half. See `hydrate.spec.tsx` for why this runs in Node and installs jsdom later.
type Library = typeof serverLibrary

// Built with whichever copy of the library is passed: the server's for the HTML, the client's
// for hydration. Both share one React (see `clientEnvironment.ts`).
const CASES: Record<string, (library: Library) => React.ReactElement> = {
  Combobox: ({ Combobox, ComboboxItem }) => (
    <Combobox aria-label="Fruit">
      <ComboboxItem id="apple">Apple</ComboboxItem>
      <ComboboxItem id="banana">Banana</ComboboxItem>
    </Combobox>
  ),
  Autocomplete: ({ Autocomplete, AutocompleteItem }) => (
    <Autocomplete aria-label="Fruit">
      <AutocompleteItem id="apple">Apple</AutocompleteItem>
      <AutocompleteItem id="banana">Banana</AutocompleteItem>
    </Autocomplete>
  ),
  'open Popover': ({ Button, Popover }) => (
    <Popover content="Popover body" visible>
      <Button>Trigger</Button>
    </Popover>
  ),
  'placed Toaster': ({ Toast, ToastBody, Toaster }) => (
    <Toaster placement="bottom-end">
      <Toast autohide={false} visible>
        <ToastBody>Toast body</ToastBody>
      </Toast>
    </Toaster>
  ),
  MenuSubmenu: ({ Menu, MenuItem, MenuList, MenuSubmenu, MenuToggle }) => (
    <Menu>
      <MenuToggle>Toggle</MenuToggle>
      <MenuList>
        <MenuSubmenu trigger="File">
          <MenuItem>New file</MenuItem>
        </MenuSubmenu>
      </MenuList>
    </Menu>
  )
}

// The public `Portal` and `useHydrated` themselves.
const HydratedText = ({ library }: { library: Library }) => (
  <p>{library.useHydrated() ? 'Hydrated' : 'Server'}</p>
)
CASES['Portal with a fallback'] = ({ Portal }) => (
  <Portal fallback={<span>Loading</span>}>
    <div>Portaled</div>
  </Portal>
)
CASES.useHydrated = (library) => <HydratedText library={library} />

const serverHtml = Object.fromEntries(
  Object.entries(CASES).map(([name, build]) => [name, renderToString(build(serverLibrary))])
)

let client: {
  React: typeof import('react')
  hydrateRoot: typeof import('react-dom/client').hydrateRoot
  library: Library
  testingLibrary: typeof import('@testing-library/react')
  userEvent: typeof import('@testing-library/user-event').default
}

beforeAll(async () => {
  await installClientEnvironment()
  client = {
    React: await import('react'),
    hydrateRoot: (await import('react-dom/client')).hydrateRoot,
    library: await import('../../src/index'),
    testingLibrary: await import('@testing-library/react'),
    userEvent: (await import('@testing-library/user-event')).default
  }
}, 60_000)

let unmount: (() => Promise<void>) | undefined

afterEach(async () => {
  await unmount?.()
  unmount = undefined
  document.body.innerHTML = ''
})

// Hydrates a case's server HTML and returns the element it was hydrated into.
async function hydrate(name: string): Promise<HTMLElement> {
  const { React: ClientReact, hydrateRoot, library } = client
  const errors: unknown[] = []
  const host = document.createElement('div')
  host.innerHTML = serverHtml[name]!
  document.body.appendChild(host)

  let root: ReturnType<typeof hydrateRoot> | undefined
  await ClientReact.act(async () => {
    root = hydrateRoot(host, CASES[name]!(library), {
      onRecoverableError: (error) => errors.push(error)
    })
  })
  unmount = () => ClientReact.act(async () => root?.unmount())

  expect(errors).toEqual([])
  return host
}

describe('Portal and useHydrated', () => {
  test('the server renders the fallback and the server value', () => {
    expect(serverHtml['Portal with a fallback']).toBe('<span>Loading</span>')
    expect(serverHtml.useHydrated).toBe('<p>Server</p>')
  })

  test('after hydration, the children are in document.body and the fallback is gone', async () => {
    const host = await hydrate('Portal with a fallback')
    const screen = client.testingLibrary.within(document.body)

    expect(host).not.toContainElement(screen.getByText('Portaled'))
    expect(client.testingLibrary.within(host).queryByText('Loading')).toBeNull()
  })

  test('after hydration, useHydrated is true', async () => {
    const host = await hydrate('useHydrated')
    expect(client.testingLibrary.within(host).getByText('Hydrated')).toBeInTheDocument()
  })
})

describe('portaled content after hydration', () => {
  test('Combobox opens its list', async () => {
    const screen = client.testingLibrary.within(document.body)
    const user = client.userEvent.setup()
    await hydrate('Combobox')

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }))
    expect(await screen.findByRole('option', { name: 'Banana' })).toBeVisible()
  })

  test('Autocomplete opens its search and list', async () => {
    const screen = client.testingLibrary.within(document.body)
    const user = client.userEvent.setup()
    await hydrate('Autocomplete')

    await user.click(screen.getByRole('button', { name: 'Fruit' }))
    expect(await screen.findByRole('option', { name: 'Banana' })).toBeVisible()
  })

  test('an open Popover appears once hydrated, outside the hydrated element', async () => {
    const screen = client.testingLibrary.within(document.body)
    expect(serverHtml['open Popover']).not.toContain('Popover body')
    const host = await hydrate('open Popover')

    const body = screen.getByText('Popover body')
    expect(host).not.toContainElement(body)
  })

  test('a placed Toaster appears once hydrated, outside the hydrated element', async () => {
    const screen = client.testingLibrary.within(document.body)
    expect(serverHtml['placed Toaster']).toBe('')
    const host = await hydrate('placed Toaster')

    const toast = screen.getByText('Toast body')
    expect(host).not.toContainElement(toast)
  })

  test('a submenu panel is server-rendered inline, then moves out once hydrated', async () => {
    const screen = client.testingLibrary.within(document.body)
    expect(serverHtml.MenuSubmenu).toContain('New file')
    const host = await hydrate('MenuSubmenu')

    const item = screen.getByText('New file')
    expect(host).not.toContainElement(item)
  })
})
