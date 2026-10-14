import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../../src/components/button/Button'
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  CardImage,
  CardImageOverlay,
  CardLink,
  CardText,
  CardTitle
} from '../../src/components/card'
import { Flex } from '../../src/components/flex/Flex'
import { Grid } from '../../src/components/grid/Grid'
import { GridItem } from '../../src/components/grid/GridItem'
import { List } from '../../src/components/list/List'
import { ListItem } from '../../src/components/list/ListItem'
import { Placeholder } from '../../src/components/placeholder/Placeholder'
import { Stack } from '../../src/components/stack/Stack'
import { StaticTable } from '../../src/components/static-table/StaticTable'

// One page of the layout primitives and the content containers in their main states, for a single
// visual regression screenshot (`test/visual/overview-layout-and-content.visual.spec.ts`). None of
// these components has styles of its own: they apply `@chassis-ui/css` classes, so what can move
// them is a change to chassis-css, its spacing tokens above all, and one screenshot of all of them
// side by side catches it (#45). A component that gains styles or runtime layout of its own gets a
// per-story spec instead.
//
// The page has a fixed width, so the screenshot doesn't depend on the viewport, and no story-level
// state: every value is a default, nothing takes focus. The images are inline, so the page loads
// nothing from the network.
const meta: Meta = {
  title: 'overview/Layout and content',
  tags: ['!autodocs']
}

export default meta

type Story = StoryObj

const PAGE: React.CSSProperties = {
  display: 'grid',
  gap: '2rem 3rem',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'start',
  width: 960
}

const STACK: React.CSSProperties = { display: 'grid', gap: '1rem' }

function Section({
  title,
  children,
  wide
}: {
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <section style={wide ? { ...STACK, gridColumn: '1 / -1' } : STACK}>
      <h2 className="h6 mb-0">{title}</h2>
      {children}
    </section>
  )
}

const BOX = 'primary-dim-slight primary-border-subtle border p-xs text-center'

function Box({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className ? `${className} ${BOX}` : BOX}>{children}</div>
}

const IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">' +
      '<rect width="400" height="200" fill="#495057"/>' +
      '<circle cx="300" cy="60" r="28" fill="#ffc107"/>' +
      '<path d="M0 200 L130 90 L230 170 L290 120 L400 200 Z" fill="#20c997"/>' +
      '</svg>'
  )

const ROWS = [
  { name: 'Mark Otto', role: 'Engineer', handle: 'mdo' },
  { name: 'Jacob Thornton', role: 'Designer', handle: 'fat' },
  { name: 'Larry Bird', role: 'Engineer', handle: 'bird' }
]

function TableRows() {
  return (
    <>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
          <th scope="col">Profile</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row.handle}>
            <td data-cell="Name">{row.name}</td>
            <td data-cell="Role">{row.role}</td>
            <td data-cell="Profile">
              <a href={`#${row.handle}`}>@{row.handle}</a>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  )
}

export const Default: Story = {
  render: () => (
    <div style={PAGE}>
      <Section title="Grid and GridItem" wide>
        <Grid>
          {[1, 2, 3].map((n) => (
            <Box key={n} className="col-span-4">
              col-span-4
            </Box>
          ))}
        </Grid>
        <Grid columns={4} gap="lg">
          {[1, 2, 3, 4].map((n) => (
            <Box key={n}>columns=4 gap=lg</Box>
          ))}
        </Grid>
        <Grid gap="xs">
          <GridItem span={4} start={3} className={BOX}>
            span=4 start=3
          </GridItem>
          <GridItem span={3} end={13} className={BOX}>
            span=3 end=13
          </GridItem>
          <GridItem span={8} subgrid className={BOX}>
            <GridItem span={4} className={BOX}>
              subgrid span=4
            </GridItem>
            <GridItem span={4} className={BOX}>
              subgrid span=4
            </GridItem>
          </GridItem>
          <GridItem span={4} className={BOX}>
            span=4
          </GridItem>
        </Grid>
        <Grid columns={3} rows={2} flow="column" gap="sm">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Box key={n}>flow=column {n}</Box>
          ))}
        </Grid>
        <Grid fill min="12rem" gap="md">
          {[1, 2, 3, 4, 5].map((n) => (
            <Box key={n}>fill min=12rem</Box>
          ))}
        </Grid>
        <div className="contains-inline" style={{ width: '24rem' }}>
          <Grid columns={{ base: 1, '@md': 3 }} contained>
            {[1, 2, 3].map((n) => (
              <Box key={n}>contained, 24rem wide</Box>
            ))}
          </Grid>
        </div>
      </Section>

      <Section title="Flex">
        <Flex gap="md">
          <Box>gap=md</Box>
          <Box>Second</Box>
          <Box>Third</Box>
        </Flex>
        <Flex justify="between">
          <Box>justify=between</Box>
          <Box>Second</Box>
          <Box>Third</Box>
        </Flex>
        <Flex align="center" gap="sm" style={{ height: 80 }} className="border">
          <Box>align=center</Box>
          <Box>Second</Box>
        </Flex>
        <Flex direction="column" gap="xs">
          <Box>direction=column</Box>
          <Box>Second</Box>
        </Flex>
        <Flex wrap="wrap" gap="2xs" style={{ width: 260 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Box key={n}>wrap {n}</Box>
          ))}
        </Flex>
      </Section>

      <Section title="Stack">
        <Stack gap="md">
          <Box>Horizontal</Box>
          <Box>gap=md</Box>
          <Box>Third</Box>
        </Stack>
        <Stack direction="vertical" gap="sm">
          <Box>Vertical</Box>
          <Box>gap=sm</Box>
          <Box>Third</Box>
        </Stack>
        <Stack direction="vertical" gap="2xl">
          <Box>Vertical</Box>
          <Box>gap=2xl</Box>
        </Stack>
      </Section>

      <Section title="Card">
        <Card
          title="Card title"
          subtitle="Card subtitle"
          text="Some quick example text to build on the card title."
          image={IMAGE}
          imageAlt=""
          footer={<small className="fg-subtle">Last updated 3 mins ago</small>}
        />
        <Card>
          <CardHeader>Featured</CardHeader>
          <CardBody>
            <CardTitle>Header and footer</CardTitle>
            <CardText>With supporting text below as a natural lead-in.</CardText>
            <CardLink href="#">Card link</CardLink>
            <CardLink href="#">Another link</CardLink>
          </CardBody>
          <CardFooter>
            <Button color="primary" size="sm">
              Go somewhere
            </Button>
          </CardFooter>
        </Card>
        <Card color="primary" title="Primary card" text="A card in a context color." />
        <Card className="fg-white">
          <CardImage src={IMAGE} alt="" />
          <CardImageOverlay>
            <CardTitle>Image overlay</CardTitle>
            <CardText>Text over the image.</CardText>
          </CardImageOverlay>
        </Card>
      </Section>

      <Section title="List">
        <List>
          <ListItem active>Active item</ListItem>
          <ListItem>An item</ListItem>
          <ListItem color="success">A success item</ListItem>
          <ListItem disabled>A disabled item</ListItem>
        </List>
        <List>
          <ListItem href="#" active>
            An active link
          </ListItem>
          <ListItem href="#">A link</ListItem>
          <ListItem href="#" disabled>
            A disabled link
          </ListItem>
        </List>
        <List flush>
          <ListItem>A flush list</ListItem>
          <ListItem>Without borders</ListItem>
        </List>
        <List component="ol" numbered>
          <ListItem>A numbered item</ListItem>
          <ListItem>A numbered item</ListItem>
        </List>
      </Section>

      <Section title="StaticTable" wide>
        <Grid columns={2} gap="lg" style={{ alignItems: 'start' }}>
          <StaticTable aria-label="Default table">
            <TableRows />
          </StaticTable>
          <StaticTable aria-label="Variant table" bordered hover striped>
            <TableRows />
          </StaticTable>
          <StaticTable aria-label="Colored table" color="primary">
            <TableRows />
          </StaticTable>
          <StaticTable caption="Team members">
            <TableRows />
            <tfoot>
              <tr>
                <td colSpan={3}>3 members</td>
              </tr>
            </tfoot>
          </StaticTable>
        </Grid>
      </Section>

      <Section title="Placeholder and CardGroup" wide>
        <Flex gap="sm" wrap="wrap" align="center">
          <Placeholder width={200} height={110} title="Cover" text="No cover yet" />
          <Placeholder color="primary" width={140} height={110} />
          <Placeholder color="danger" width={140} height={110} text={false} />
          <Placeholder src={IMAGE} alt="" width={160} height={80} thumbnail />
          <Placeholder src={IMAGE} alt="" width={160} height={80} rounded />
        </Flex>
        <div className="contains-inline">
          <CardGroup>
            <Card title="Grouped card" text="Cards in a group share their borders." />
            <Card title="Grouped card" text="From the sm container breakpoint up." />
            <Card title="Grouped card" text="One joined row." />
          </CardGroup>
        </div>
      </Section>
    </div>
  )
}
