import React from 'react'
import { useState } from 'react'
import { Button, CxForm, CxCheckbox, CxTextInput, CxFormFeedback, CxFormLabel, CxSelect, CxInputGroup, CxInputAddon, Col } from '@chassis-ui/react'

export const BrowserDefaultsExample = () => {
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
    <CxForm className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
      <Col md={4}>
        <CxFormLabel htmlFor="validationDefault01">Email</CxFormLabel>
        <CxTextInput type="text" id="validationDefault01" defaultValue="Mark" required />
        <CxFormFeedback valid>Looks good!</CxFormFeedback>
      </Col>
      <Col md={4}>
        <CxFormLabel htmlFor="validationDefault02">Email</CxFormLabel>
        <CxTextInput type="text" id="validationDefault02" defaultValue="Otto" required />
        <CxFormFeedback valid>Looks good!</CxFormFeedback>
      </Col>
      <Col md={4}>
        <CxFormLabel htmlFor="validationDefaultUsername">Username</CxFormLabel>
        <CxInputGroup className="has-validation">
          <CxInputAddon id="inputGroupPrepend02">@</CxInputAddon>
          <CxTextInput
            type="text"
            id="validationDefaultUsername"
            defaultValue=""
            aria-describedby="inputGroupPrepend02"
            required
          />
          <CxFormFeedback invalid>Please choose a username.</CxFormFeedback>
        </CxInputGroup>
      </Col>
      <Col md={6}>
        <CxFormLabel htmlFor="validationDefault03">City</CxFormLabel>
        <CxTextInput type="text" id="validationDefault03" required />
        <CxFormFeedback invalid>Please provide a valid city.</CxFormFeedback>
      </Col>
      <Col md={3}>
        <CxFormLabel htmlFor="validationDefault04">City</CxFormLabel>
        <CxSelect id="validationDefault04">
          <option disabled>Choose...</option>
          <option>...</option>
        </CxSelect>
        <CxFormFeedback invalid>Please provide a valid city.</CxFormFeedback>
      </Col>
      <Col md={3}>
        <CxFormLabel htmlFor="validationDefault05">City</CxFormLabel>
        <CxTextInput type="text" id="validationDefault05" required />
        <CxFormFeedback invalid>Please provide a valid zip.</CxFormFeedback>
      </Col>
      <Col xs={12}>
        <CxCheckbox
          type="checkbox"
          id="invalidCheck"
          label="Agree to terms and conditions"
          required
        />
        <CxFormFeedback invalid>You must agree before submitting.</CxFormFeedback>
      </Col>
      <Col xs={12}>
        <Button color="primary" type="submit">
          Submit form
        </Button>
      </Col>
    </CxForm>
  )
}
