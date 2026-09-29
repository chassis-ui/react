import { Stepper, StepperItem } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <Stepper data-testid="with-link">
        <StepperItem component="a" href="/rsc/list">
          Cart <ClientMark />
        </StepperItem>
        <StepperItem active>Payment</StepperItem>
      </Stepper>
      <Stepper data-testid="plain">
        <StepperItem>Review</StepperItem>
      </Stepper>
    </main>
  )
}
