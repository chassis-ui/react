import { useState } from 'react'
import {
  Alert,
  AlertBody,
  AlertCancel,
  AlertFooter,
  AlertIcon,
  AlertText,
  AlertTitle,
  Button,
  TextInput
} from '@chassis-ui/react'

export const Example = () => {
  const [step, setStep] = useState<'none' | 'ask' | 'confirm'>('none')
  const [typed, setTyped] = useState('')
  const close = () => {
    setStep('none')
    setTyped('')
  }
  return (
    <>
      <Button color="danger" onClick={() => setStep('ask')}>
        Delete account
      </Button>
      <Alert visible={step === 'ask'} onClose={close}>
        <AlertIcon name="exclamation-triangle-solid" color="danger" />
        <AlertBody>
          <AlertTitle>Delete your account?</AlertTitle>
          <AlertText>All of your data will be removed.</AlertText>
        </AlertBody>
        <AlertFooter>
          <Button color="danger" onClick={() => setStep('confirm')}>
            Delete account
          </Button>
          <AlertCancel>Cancel</AlertCancel>
        </AlertFooter>
      </Alert>
      <Alert visible={step === 'confirm'} onClose={close}>
        <AlertIcon name="exclamation-triangle-solid" color="danger" />
        <AlertBody>
          <AlertTitle>Final confirmation</AlertTitle>
          <AlertText>
            This is permanent. Type <strong>DELETE</strong> to confirm.
          </AlertText>
          <TextInput
            aria-label="Type DELETE to confirm"
            data-autofocus=""
            value={typed}
            onChange={setTyped}
          />
        </AlertBody>
        <AlertFooter>
          <Button color="danger" disabled={typed !== 'DELETE'} onClick={close}>
            Confirm delete
          </Button>
          <AlertCancel>Cancel</AlertCancel>
          <Button className="sm:me-auto" variant="link" onClick={() => setStep('ask')}>
            Go back
          </Button>
        </AlertFooter>
      </Alert>
    </>
  )
}
