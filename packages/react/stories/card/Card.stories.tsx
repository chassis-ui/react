import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

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
import { Button } from '../../src/components/button/Button'

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'card/Card'
}

export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    title: 'Card title',
    subtitle: 'Card subtitle',
    text: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    image: 'https://placehold.co/800x400',
    imageOrientation: 'top'
  }
}

export const ManualMarkup: Story = {
  args: {
    children: (
      <>
        <CardImage orientation="top" src="https://placehold.co/800x400" />
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </CardText>
          <Button href="#" className="me-auto">
            Go somewhere
          </Button>
        </CardBody>
      </>
    )
  }
}

export const HeaderAndFooter: Story = {
  args: {
    children: (
      <>
        <CardHeader>Featured</CardHeader>
        <CardBody>
          <CardTitle>Special title treatment</CardTitle>
          <CardText>
            With supporting text below as a natural lead-in to additional content.
          </CardText>
          <Button href="#" color="primary" className="me-auto">
            Go somewhere
          </Button>
        </CardBody>
        <CardFooter className="text-muted">2 days ago</CardFooter>
      </>
    )
  },
  play: async function ({ canvas }) {
    await expect(canvas.getByText('Featured')).toHaveClass('card-header')
    await expect(canvas.getByText('2 days ago')).toHaveClass('card-footer', 'text-muted')
    await expect(canvas.getByRole('heading', { name: 'Special title treatment' })).toBeVisible()
  }
}

export const Links: Story = {
  args: {
    children: (
      <CardBody>
        <CardTitle>Card title</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card's
          content.
        </CardText>
        <CardLink href="#">Card link</CardLink>
        <CardLink href="#">Another link</CardLink>
      </CardBody>
    )
  },
  play: async function ({ canvas }) {
    const links = canvas.getAllByRole('link')
    await expect(links).toHaveLength(2)
    for (const link of links) {
      await expect(link).toHaveClass('card-link')
      await expect(link).toHaveAttribute('href', '#')
    }
    await expect(canvas.getByRole('link', { name: 'Another link' })).toBeVisible()
  }
}

// `CardImageOverlay` sits over a `CardImage` composed as a direct child: the `image` shorthand has
// no slot for it.
export const ImageOverlay: Story = {
  args: {
    className: 'text-white',
    children: (
      <>
        <CardImage src="https://placehold.co/800x400/333333/333333" alt="" />
        <CardImageOverlay>
          <CardTitle>Card title</CardTitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in to additional
            content.
          </CardText>
          <CardText>
            <small>Last updated 3 mins ago</small>
          </CardText>
        </CardImageOverlay>
      </>
    )
  },
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('heading', { name: 'Card title' })).toBeVisible()
    await expect(canvas.getByText('Last updated 3 mins ago')).toBeVisible()
  }
}

// `CardGroup` lays its cards out as one joined row from the `sm` container breakpoint up, and
// needs a `.contains-inline` ancestor for that container query (see `CardGroup.tsx`).
export const Group: Story = {
  render: () => (
    <div className="contains-inline">
      <CardGroup>
        <Card
          title="Card title"
          text="This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer."
          footer={<small className="text-muted">Last updated 3 mins ago</small>}
          image="https://placehold.co/800x400"
        />
        <Card
          title="Card title"
          text="This card has supporting text below as a natural lead-in to additional content."
          footer={<small className="text-muted">Last updated 3 mins ago</small>}
          image="https://placehold.co/800x400"
        />
        <Card
          title="Card title"
          text="This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action."
          footer={<small className="text-muted">Last updated 3 mins ago</small>}
          image="https://placehold.co/800x400"
        />
      </CardGroup>
    </div>
  ),
  play: async function ({ canvas }) {
    await expect(canvas.getAllByRole('heading', { name: 'Card title' })).toHaveLength(3)
    await expect(canvas.getAllByText('Last updated 3 mins ago')).toHaveLength(3)
  }
}
