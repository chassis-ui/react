import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxForm,
  CxFormCheck,
  CxFormInput,
  CxFormFeedback,
  CxFormLabel,
  CxFormSelect,
  CxInputGroup,
  CxInputGroupText,
  CxCol,
  CxRow,
} from '@chassis-ui/react'

export const BrowserDefaultsExample = () => {
  const [validated, setValidated] = useState(false)
  const handleSubmit = (event) => {
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
        <CxFormInput type="text" id="validationDefault01" defaultValue="Mark" required />
        <CxFormFeedback valid>Looks good!</CxFormFeedback>
      </CxCol>
      <CxCol md={4}>
        <CxFormLabel htmlFor="validationDefault02">Email</CxFormLabel>
        <CxFormInput type="text" id="validationDefault02" defaultValue="Otto" required />
        <CxFormFeedback valid>Looks good!</CxFormFeedback>
      </CxCol>
      <CxCol md={4}>
        <CxFormLabel htmlFor="validationDefaultUsername">Username</CxFormLabel>
        <CxInputGroup className="has-validation">
          <CxInputGroupText id="inputGroupPrepend02">@</CxInputGroupText>
          <CxFormInput
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
        <CxFormInput type="text" id="validationDefault03" required />
        <CxFormFeedback invalid>Please provide a valid city.</CxFormFeedback>
      </CxCol>
      <CxCol md={3}>
        <CxFormLabel htmlFor="validationDefault04">City</CxFormLabel>
        <CxFormSelect id="validationDefault04">
          <option disabled>Choose...</option>
          <option>...</option>
        </CxFormSelect>
        <CxFormFeedback invalid>Please provide a valid city.</CxFormFeedback>
      </CxCol>
      <CxCol md={3}>
        <CxFormLabel htmlFor="validationDefault05">City</CxFormLabel>
        <CxFormInput type="text" id="validationDefault05" required />
        <CxFormFeedback invalid>Please provide a valid zip.</CxFormFeedback>
      </CxCol>
      <CxCol xs={12}>
        <CxFormCheck
          type="checkbox"
          id="invalidCheck"
          label="Agree to terms and conditions"
          required
        />
        <CxFormFeedback invalid>You must agree before submitting.</CxFormFeedback>
      </CxCol>
      <CxCol xs={12}>
        <CxButton context="primary" type="submit">
          Submit form
        </CxButton>
      </CxCol>
    </CxForm>
  )
}
