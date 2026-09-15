import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'

import { Button } from '../../src/components/button/Button'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../../src/components/drawer'

const meta: Meta<typeof Drawer> = {
  component: Drawer,
  title: 'drawer/Drawer'
}

export default meta

type Story = StoryObj<typeof Drawer>

// `visible` opens the dialog synchronously on mount (see `useDialogElement`), so a Storybook
// screenshot/interaction test never has to drive a real trigger click first.
export const Default: Story = {
  args: {
    'aria-label': 'Example drawer',
    placement: 'start',
    visible: true,
    onClose: fn(),
    children: (
      <>
        <DrawerHeader closeButton>
          <DrawerTitle>Drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Drawer body content goes here.</p>
        </DrawerBody>
      </>
    )
  },
  play: async function ({ args, canvas }) {
    const dialog = await waitFor(() => canvas.getByRole('dialog'))
    const closeButton = canvas.getByRole('button', { name: /close/i })

    await expect(dialog).toBeVisible()
    closeButton.click()
    await expect(args.onClose).toHaveBeenCalled()
  }
}

export const PlacementEnd: Story = {
  args: {
    'aria-label': 'End drawer',
    placement: 'end',
    visible: true,
    onClose: fn(),
    children: (
      <>
        <DrawerHeader closeButton>
          <DrawerTitle>End drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>Slides in from the end (right, in LTR).</DrawerBody>
      </>
    )
  }
}

export const PlacementTop: Story = {
  args: {
    'aria-label': 'Top drawer',
    placement: 'top',
    visible: true,
    onClose: fn(),
    children: (
      <>
        <DrawerHeader closeButton>
          <DrawerTitle>Top drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>Slides down from the top.</DrawerBody>
      </>
    )
  }
}

export const PlacementBottom: Story = {
  args: {
    'aria-label': 'Bottom drawer',
    placement: 'bottom',
    visible: true,
    onClose: fn(),
    children: (
      <>
        <DrawerHeader closeButton>
          <DrawerTitle>Bottom drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>Slides up from the bottom.</DrawerBody>
      </>
    )
  }
}

export const Fullscreen: Story = {
  args: {
    'aria-label': 'Fullscreen drawer',
    placement: 'start',
    fullscreen: true,
    visible: true,
    onClose: fn(),
    children: (
      <>
        <DrawerHeader closeButton>
          <DrawerTitle>Fullscreen drawer</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>Expands to fill the viewport.</DrawerBody>
      </>
    )
  }
}

export const StaticBackdrop: Story = {
  args: {
    'aria-label': 'Static backdrop drawer',
    placement: 'start',
    backdrop: 'static',
    visible: true,
    onClose: fn(),
    onClosePrevented: fn(),
    children: (
      <>
        <DrawerHeader closeButton>
          <DrawerTitle>Static backdrop</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>Clicking outside nudges the drawer instead of closing it.</DrawerBody>
      </>
    )
  }
}

export const LiveDemo: Story = {
  render: function LiveDemoDrawer() {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <Button onClick={() => setVisible(true)}>Open drawer</Button>
        <Drawer
          aria-label="Demo drawer"
          placement="start"
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <DrawerHeader closeButton>
            <DrawerTitle>Drawer</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p>Drawer body content goes here.</p>
          </DrawerBody>
          <DrawerFooter>
            <Button color="secondary" onClick={() => setVisible(false)}>
              Close
            </Button>
          </DrawerFooter>
        </Drawer>
      </>
    )
  },
  play: async function ({ canvas }) {
    const trigger = canvas.getByRole('button', { name: /open drawer/i })
    trigger.click()
    const dialog = await waitFor(() => canvas.getByRole('dialog'))
    await expect(dialog).toBeVisible()
  }
}
