import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'

import { Button } from '../../src/components/button/Button'
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../src/components/modal'

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'modal/Modal'
}

export default meta

type Story = StoryObj<typeof Modal>

// `visible` opens the dialog synchronously on mount (see `useDialogElement`), so a Storybook
// screenshot/interaction test never has to drive a real trigger click first.
export const Default: Story = {
  args: {
    'aria-label': 'Example modal',
    visible: true,
    onClose: fn(),
    children: (
      <>
        <ModalHeader closeButton>
          <ModalTitle>Modal title</ModalTitle>
        </ModalHeader>
        <ModalBody>Woohoo, you&apos;re reading this text in a modal!</ModalBody>
        <ModalFooter>
          <Button color="secondary">Cancel</Button>
          <Button color="primary">Save changes</Button>
        </ModalFooter>
      </>
    )
  },
  play: async function ({ args, canvas }) {
    // `.dialog` opens at `opacity: 0` and transitions in (see chassis-css's `_dialog.scss` entry
    // state), and jest-dom counts `opacity: 0` as not visible — so the assertion itself has to be
    // inside `waitFor`, not just the query that finds the element.
    const dialog = await waitFor(() => canvas.getByRole('dialog'))
    await waitFor(() => expect(dialog).toBeVisible())

    // The header's dismiss control, not the footer's — `ModalHeader closeButton` renders a
    // `CloseButton` whose accessible name is "Close", so the footer deliberately says "Cancel"
    // rather than "Close" to keep this query unambiguous.
    canvas.getByRole('button', { name: 'Close' }).click()
    await expect(args.onClose).toHaveBeenCalled()
  }
}

export const Sizes: Story = {
  args: {
    'aria-label': 'Large modal',
    visible: true,
    size: 'lg',
    onClose: fn(),
    children: (
      <>
        <ModalHeader closeButton>
          <ModalTitle>Large modal</ModalTitle>
        </ModalHeader>
        <ModalBody>This modal uses the `lg` size.</ModalBody>
      </>
    )
  }
}

export const Fullscreen: Story = {
  args: {
    'aria-label': 'Fullscreen modal',
    visible: true,
    fullscreen: true,
    onClose: fn(),
    children: (
      <>
        <ModalHeader closeButton>
          <ModalTitle>Fullscreen modal</ModalTitle>
        </ModalHeader>
        <ModalBody>Covers the entire viewport.</ModalBody>
      </>
    )
  }
}

export const StaticBackdrop: Story = {
  args: {
    'aria-label': 'Static backdrop modal',
    visible: true,
    backdrop: 'static',
    onClose: fn(),
    onClosePrevented: fn(),
    children: (
      <>
        <ModalHeader closeButton>
          <ModalTitle>Static backdrop</ModalTitle>
        </ModalHeader>
        <ModalBody>Clicking outside bounces the modal instead of closing it.</ModalBody>
      </>
    )
  }
}

export const LiveDemo: Story = {
  render: function LiveDemoModal() {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <Button onClick={() => setVisible(true)}>Launch demo modal</Button>
        <Modal aria-label="Demo modal" visible={visible} onClose={() => setVisible(false)}>
          <ModalHeader closeButton>
            <ModalTitle>Modal title</ModalTitle>
          </ModalHeader>
          <ModalBody>Woohoo, you&apos;re reading this text in a modal!</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button color="primary">Save changes</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  },
  play: async function ({ canvas }) {
    const trigger = canvas.getByRole('button', { name: /launch demo modal/i })
    trigger.click()
    const dialog = await waitFor(() => canvas.getByRole('dialog'))
    await waitFor(() => expect(dialog).toBeVisible())
  }
}
