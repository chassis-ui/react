import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Alert,
  AlertBody,
  AlertCancel,
  AlertCode,
  AlertFooter,
  AlertIcon,
  AlertText,
  AlertTitle
} from '../../src/components/alert'
import { Button } from '../../src/components/button/Button'

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: 'alert/Alert'
}

export default meta

type Story = StoryObj<typeof Alert>

export const Confirm: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <Button color="danger" onClick={() => setVisible(true)}>
          Delete file
        </Button>
        <Alert visible={visible} onVisibleChange={setVisible}>
          <AlertIcon name="exclamation-triangle-solid" color="danger" />
          <AlertBody>
            <AlertTitle>Delete the file?</AlertTitle>
            <AlertText>This file will be removed for everyone. This can't be undone.</AlertText>
          </AlertBody>
          <AlertFooter>
            <Button color="danger" onClick={() => setVisible(false)}>
              Delete file
            </Button>
            <AlertCancel>Cancel</AlertCancel>
          </AlertFooter>
        </Alert>
      </>
    )
  }
}

export const ErrorCode: Story = {
  render: () => (
    <Alert defaultVisible>
      <AlertIcon name="exclamation-circle-solid" color="danger" />
      <AlertBody>
        <AlertTitle>Upload failed</AlertTitle>
        <AlertCode>ERR-1234</AlertCode>
        <AlertText>
          The server refused the file. Try again, or contact support with the code.
        </AlertText>
      </AlertBody>
      <AlertFooter>
        <AlertCancel>Close</AlertCancel>
      </AlertFooter>
    </Alert>
  )
}

export const StackedWithCloseButton: Story = {
  render: () => (
    <Alert closeButton defaultVisible>
      <AlertBody>
        <AlertTitle>Save changes?</AlertTitle>
        <AlertText>Do you want to save your changes before leaving the page?</AlertText>
      </AlertBody>
      <AlertFooter stacked>
        <Button color="primary">Save changes</Button>
        <AlertCancel>Cancel</AlertCancel>
        <Button className="sm:me-auto" color="danger" variant="outline">
          Discard
        </Button>
      </AlertFooter>
    </Alert>
  )
}
