// How each component's card lays out its stories, where the default grid of labelled cells
// doesn't fit. `primary` and `skip` name story exports.
import type { Card } from './runtime/preview.ts'

export const CARDS: Record<string, Card> = {
  // Overlays that portal to <body> or position themselves: a cell can't hold them, so the card
  // shows the one story that renders them open.
  Alert: { mode: 'single', primary: 'StackedWithCloseButton' },
  ContextMenu: { mode: 'single', primary: 'Open' },
  DatePicker: { mode: 'single', primary: 'Open' },
  DateRangePicker: { mode: 'single', primary: 'OpenWithPresets' },
  Drawer: { mode: 'single', primary: 'Default' },
  Menu: { mode: 'single', primary: 'Open' },
  Modal: { mode: 'single', primary: 'Default' },
  // One tooltip opens at a time per page, and the popover story's margin clamps a cell.
  Popover: { mode: 'single', primary: 'Open' },
  Toast: { mode: 'single', primary: 'Basic' },
  Tooltip: { mode: 'single', primary: 'Top' },
  // Stories that are wide, or reflow with their container: one full-width row each.
  Carousel: { mode: 'column' },
  Container: { mode: 'column' },
  DataGrid: { mode: 'column' },
  Divider: { mode: 'column' },
  Grid: { mode: 'column' },
  GridItem: { mode: 'column' },
  NavOverflow: { mode: 'column' },
  Navbar: { mode: 'column' },
  Pagination: { mode: 'column' },
  Placeholder: { mode: 'column' },
  Stack: { mode: 'column' },
  Table: { mode: 'column' },
  // `Closed` renders nothing.
  Collapse: { mode: 'grid', skip: ['Closed'] }
}

export const DEFAULT_CARD: Card = { mode: 'grid' }

// The card's row height on the page, which then grows to fit its content. A single overlay story
// gets room for what it opens, since a portaled overlay doesn't grow the row.
export const cardHeight = (card: Card) => (card.mode === 'single' ? 420 : 240)
