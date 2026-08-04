import React from 'react'
import { useState } from 'react'
import { Button, CxForm, CxTextInput, CxFormFeedback, CxFormLabel, CxSelect, CxInputGroup, CxInputAddon, Col } from '@chassis-ui/react'

export const TooltipsExample = () => {
  const [validated, setValidated] = useState(false)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }
  return (
    <CxForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Col md={4} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip01">Email</CxFormLabel>
        <CxTextInput type="text" id="validationTooltip01" defaultValue="Mark" required />
        <CxFormFeedback tooltip valid>
          Looks good!
        </CxFormFeedback>
      </Col>
      <Col md={4} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip02">Email</CxFormLabel>
        <CxTextInput type="text" id="validationTooltip02" defaultValue="Otto" required />
        <CxFormFeedback tooltip valid>
          Looks good!
        </CxFormFeedback>
      </Col>
      <Col md={4} className="position-relative">
        <CxFormLabel htmlFor="validationTooltipUsername">Username</CxFormLabel>
        <CxInputGroup className="has-validation">
          <CxInputAddon id="inputGroupPrepend">@</CxInputAddon>
          <CxTextInput
            type="text"
            id="validationTooltipUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend"
            required
          />
          <CxFormFeedback tooltip invalid>
            Please choose a username.
          </CxFormFeedback>
        </CxInputGroup>
      </Col>
      <Col md={6} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip03">City</CxFormLabel>
        <CxTextInput type="text" id="validationTooltip03" required />
        <CxFormFeedback tooltip invalid>
          Please provide a valid city.
        </CxFormFeedback>
      </Col>
      <Col md={3} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip04">City</CxFormLabel>
        <CxSelect id="validationTooltip04" required>
          <option disabled value="">
            Choose...
          </option>
          <option>...</option>
        </CxSelect>
        <CxFormFeedback tooltip invalid>
          Please provide a valid city.
        </CxFormFeedback>
      </Col>
      <Col md={3} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip05">City</CxFormLabel>
        <CxTextInput type="text" id="validationTooltip05" required />
        <CxFormFeedback tooltip invalid>
          Please provide a valid zip.
        </CxFormFeedback>
      </Col>
      <Col xs={12} className="position-relative">
        <Button color="primary" type="submit">
          Submit form
        </Button>
      </Col>
    </CxForm>
  )
}
