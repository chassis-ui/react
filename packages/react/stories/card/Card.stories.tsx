import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'

import { Card, CardBody, CardImage, CardText, CardTitle } from '../../src/components/card'
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
