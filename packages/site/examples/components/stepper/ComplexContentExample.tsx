import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Stepper>
      <StepperItem className="align-items-start">
        <div>
          <div className="font-strong">Account</div>
          <div className="fg-subtle">Create a username and password.</div>
        </div>
      </StepperItem>
      <StepperItem active className="align-items-start">
        <div>
          <div className="font-strong">Shipping</div>
          <div className="fg-subtle">Where should the order ship?</div>
        </div>
      </StepperItem>
      <StepperItem className="align-items-start">
        <div>
          <div className="font-strong">Payment</div>
          <div className="fg-subtle">Add a card or payment method.</div>
        </div>
      </StepperItem>
    </Stepper>
  )
}
