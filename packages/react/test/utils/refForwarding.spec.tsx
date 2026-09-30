import * as library from '../../src/index'

// Every component the package exports forwards a ref (see CONVENTIONS.md, "Refs"), except the
// ones below. Each entry must keep failing the check: one that starts forwarding a ref fails its
// "still has no ref" test until it is deleted from here.
const WITHOUT_REF: Record<string, string> = {
  // Collection parts: read as data by their parent, they render nothing themselves.
  AutocompleteGroup: 'collection part',
  AutocompleteItem: 'collection part',
  ComboboxGroup: 'collection part',
  ComboboxItem: 'collection part',
  Tab: 'collection part',
  TableBody: 'collection part',
  TableCell: 'collection part',
  TableColumn: 'collection part',
  TableHeader: 'collection part',
  TableRow: 'collection part',
  // No element of their own: providers, and a portal, which renders into another element.
  I18nProvider: 'provider',
  IconProvider: 'provider',
  Portal: 'portal',
  // Render react-aria-components' elements but take no ref yet: left open by audit 3 phase B8.
  DataGridBody: 'open',
  DataGridCell: 'open',
  DataGridColumn: 'open',
  DataGridHeader: 'open',
  DataGridRow: 'open',
  DataGridSelectAllCell: 'open',
  DataGridSelectionCell: 'open'
}

const FORWARD_REF = Symbol.for('react.forward_ref')

const forwardsRef = (value: unknown) =>
  typeof value === 'object' && value !== null && '$$typeof' in value
    ? value.$$typeof === FORWARD_REF
    : false

// A component is an export named in PascalCase that React can render: a function, or an object
// such as `forwardRef`'s.
const components = Object.entries(library).filter(
  ([name, value]) =>
    /^[A-Z]/.test(name) &&
    (typeof value === 'function' || (typeof value === 'object' && value !== null))
)

describe('ref forwarding', () => {
  test.each(components.filter(([name]) => !(name in WITHOUT_REF)))(
    '%s forwards a ref',
    (_, value) => {
      expect(forwardsRef(value)).toBe(true)
    }
  )

  test.each(Object.keys(WITHOUT_REF))('%s still has no ref', (name) => {
    expect(name in library).toBe(true)
    expect(forwardsRef((library as Record<string, unknown>)[name])).toBe(false)
  })
})
