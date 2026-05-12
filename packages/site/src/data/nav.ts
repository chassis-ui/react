export interface NavItem {
  title: string
  slug: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const nav: NavGroup[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', slug: 'getting-started/introduction' },
    ],
  },
  {
    title: 'Layout',
    items: [
      { title: 'Breakpoints', slug: 'layout/breakpoints' },
      { title: 'Containers', slug: 'layout/containers' },
      { title: 'Grid', slug: 'layout/grid' },
      { title: 'Columns', slug: 'layout/columns' },
      { title: 'Gutters', slug: 'layout/gutters' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Accordion', slug: 'accordion' },
      { title: 'Badge', slug: 'badge' },
      { title: 'Breadcrumb', slug: 'breadcrumb' },
      { title: 'Button', slug: 'button' },
      { title: 'Button Group', slug: 'button-group' },
      { title: 'Card', slug: 'card' },
      { title: 'Carousel', slug: 'carousel' },
      { title: 'Close Button', slug: 'close-button' },
      { title: 'Collapse', slug: 'collapse' },
      { title: 'Dropdown', slug: 'dropdown' },
      { title: 'Image', slug: 'image' },
      { title: 'List Group', slug: 'list-group' },
      { title: 'Modal', slug: 'modal' },
      { title: 'Navbar', slug: 'navbar' },
      { title: 'Navs & Tabs', slug: 'navs-tabs' },
      { title: 'Notification', slug: 'notification' },
      { title: 'Offcanvas', slug: 'offcanvas' },
      { title: 'Pagination', slug: 'pagination' },
      { title: 'Placeholder', slug: 'placeholder' },
      { title: 'Popover', slug: 'popover' },
      { title: 'Progress', slug: 'progress' },
      { title: 'Spinner', slug: 'spinner' },
      { title: 'Table', slug: 'table' },
      { title: 'Toast', slug: 'toast' },
      { title: 'Tooltip', slug: 'tooltip' },
    ],
  },
  {
    title: 'Forms',
    items: [
      { title: 'Overview', slug: 'forms/overview' },
      { title: 'Form Control', slug: 'forms/form-control' },
      { title: 'Select', slug: 'forms/select' },
      { title: 'Checks & Radios', slug: 'forms/checks-radios' },
      { title: 'Range', slug: 'forms/range' },
      { title: 'Input Group', slug: 'forms/input-group' },
      { title: 'Floating Labels', slug: 'forms/floating-labels' },
      { title: 'Layout', slug: 'forms/layout' },
      { title: 'Validation', slug: 'forms/validation' },
    ],
  },
  {
    title: 'Patterns',
    items: [
      { title: 'Dashboard Widgets', slug: 'patterns/dashboard-widgets' },
      { title: 'Form Processing', slug: 'patterns/form-processing' },
      { title: 'Paginated Table', slug: 'patterns/paginated-table' },
    ],
  },
]
