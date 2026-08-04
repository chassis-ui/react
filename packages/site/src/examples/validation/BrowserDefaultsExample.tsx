import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxForm,
  CxCheckbox,
  CxTextInput,
  CxFormFeedback,
  CxFormLabel,
  CxSelect,
  CxInputGroup,
  CxInputAddon,
  CxCol
} from '@chassis-ui/react'

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
      <CxCol md={4}>
        <CxFormLabel htmlFor="validationDefault01">Email</CxFormLabel>
        <CxTextInput type="text" id="validationDefault01" defaultValue="Mark" required />
        <CxFormFeedback valid>Looks good!</CxFormFeedback>
      </CxCol>
      <CxCol md={4}>
        <CxFormLabel htmlFor="validationDefault02">Email</CxFormLabel>
        <CxTextInput type="text" id="validationDefault02" defaultValue="Otto" required />
        <CxFormFeedback valid>Looks good!</CxFormFeedback>
      </CxCol>
      <CxCol md={4}>
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
      </CxCol>
      <CxCol md={6}>
        <CxFormLabel htmlFor="validationDefault03">City</CxFormLabel>
        <CxTextInput type="text" id="validationDefault03" required />
        <CxFormFeedback invalid>Please provide a valid city.</CxFormFeedback>
      </CxCol>
      <CxCol md={3}>
        <CxFormLabel htmlFor="validationDefault04">City</CxFormLabel>
        <CxSelect id="validationDefault04">
          <option disabled>Choose...</option>
          <option>...</option>
        </CxSelect>
        <CxFormFeedback invalid>Please provide a valid city.</CxFormFeedback>
      </CxCol>
      <CxCol md={3}>
        <CxFormLabel htmlFor="validationDefault05">City</CxFormLabel>
        <CxTextInput type="text" id="validationDefault05" required />
        <CxFormFeedback invalid>Please provide a valid zip.</CxFormFeedback>
      </CxCol>
      <CxCol xs={12}>
        <CxCheckbox
          type="checkbox"
          id="invalidCheck"
          label="Agree to terms and conditions"
          required
        />
        <CxFormFeedback invalid>You must agree before submitting.</CxFormFeedback>
      </CxCol>
      <CxCol xs={12}>
        <CxButton color="primary" type="submit">
          Submit form
        </CxButton>
      </CxCol>
    </CxForm>
  )
}
