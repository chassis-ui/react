import { createElement as h } from 'react'
import {
  AlertIcon,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Link,
  Pagination,
  Placeholder,
  Progress,
  ProgressBar,
  Skeleton,
  Spinner,
  Stack,
  StaticTable
} from '@chassis-ui/react'

// A page of a project: components and props, and not one class name. Every class in the markup
// comes from @chassis-ui/react, so Tailwind has to find each of them without help from here.
//
// Written with `createElement`, so the app needs no JSX transform.
export const page = h(
  'main',
  null,

  // The layout props, which build their class names when they render.
  h(
    Grid,
    {
      columns: { base: 2, md: 3, '@lg': 4 },
      rows: { md: 2 },
      gap: { base: 'sm', lg: 'xl' },
      flow: { xl: 'row-dense' }
    },
    h(
      GridItem,
      {
        span: { base: 'full', md: 5, '@xl': 7 },
        start: { lg: 2, '2xl': 'auto' },
        end: { '@md': 13 },
        rowSpan: { md: 2 },
        rowStart: { sm: 1 },
        rowEnd: { lg: 3 }
      },
      'Main'
    ),
    h(GridItem, { span: 4, subgrid: true, rows: 2, gap: 'xs' }, 'Aside')
  ),
  h(
    Flex,
    {
      direction: { base: 'column', md: 'row' },
      wrap: { lg: 'wrap' },
      justify: { sm: 'between' },
      align: { md: 'center' },
      alignContent: { xl: 'around' },
      gap: { base: 'xs', '2xl': '2xl' },
      rowGap: { md: 'sm' },
      columnGap: { md: 'lg' }
    },
    h(Skeleton, { span: { base: 12, md: 7 }, color: 'info' }),
    h(Skeleton, { span: true })
  ),
  h(Stack, { direction: { base: 'vertical', md: 'horizontal' }, gap: 'md' }, 'Stack'),
  h(
    Card,
    { direction: { lg: 'row' } },
    h(CardBody, { direction: { md: 'row' }, gap: 'sm' }, 'Card')
  ),

  // The color and alignment props, which map to whole class names in the built package.
  h(Progress, null, h(ProgressBar, { color: 'success', value: 40 })),
  h(Spinner, { color: 'danger' }),
  h(AlertIcon, { color: 'warning', name: 'circle-info' }),
  h(Link, { color: 'primary', href: '#' }, 'Link'),
  h(Placeholder, { align: 'end', src: '/photo.png', alt: '' }),
  h(Placeholder, { align: 'center', src: '/photo.png', alt: '' }),
  h(Pagination, { align: 'center', pages: 3, activePage: 2 }),
  h(StaticTable, { align: 'middle' }, h('tbody', null, h('tr', null, h('td', null, 'Cell'))))
)
