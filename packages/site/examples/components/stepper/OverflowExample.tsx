import { Stepper, StepperItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Stepper layout="horizontal" overflow>
      <StepperItem>First step label</StepperItem>
      <StepperItem>Past step label</StepperItem>
      <StepperItem active>Steps keep their natural width</StepperItem>
      <StepperItem>Next step label</StepperItem>
      <StepperItem>Last step label</StepperItem>
    </Stepper>
  )
}
