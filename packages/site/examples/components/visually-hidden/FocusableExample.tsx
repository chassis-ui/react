import { VisuallyHidden } from '@chassis-ui/react'

export const Example = () => (
  <>
    <VisuallyHidden component="a" focusable href="#visually-hidden-content">
      Skip to main content
    </VisuallyHidden>
    <p id="visually-hidden-content">Press Tab in this example to reveal the skip link above.</p>
  </>
)
