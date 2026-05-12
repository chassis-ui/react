import React from 'react'
import { useState } from 'react'
import {
  CxButton,
  CxDropdown,
  CxDropdownDivider,
  CxDropdownHeader,
  CxDropdownItem,
  CxDropdownItemPlain,
  CxDropdownMenu,
  CxDropdownToggle,
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

export const TooltipsExample = () => {
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
    <CxForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CxCol md={4} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip01">Email</CxFormLabel>
        <CxFormInput type="text" id="validationTooltip01" defaultValue="Mark" required />
        <CxFormFeedback tooltip valid>
          Looks good!
        </CxFormFeedback>
      </CxCol>
      <CxCol md={4} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip02">Email</CxFormLabel>
        <CxFormInput type="text" id="validationTooltip02" defaultValue="Otto" required />
        <CxFormFeedback tooltip valid>
          Looks good!
        </CxFormFeedback>
      </CxCol>
      <CxCol md={4} className="position-relative">
        <CxFormLabel htmlFor="validationTooltipUsername">Username</CxFormLabel>
        <CxInputGroup className="has-validation">
          <CxInputGroupText id="inputGroupPrepend">@</CxInputGroupText>
          <CxFormInput
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
      </CxCol>
      <CxCol md={6} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip03">City</CxFormLabel>
        <CxFormInput type="text" id="validationTooltip03" required />
        <CxFormFeedback tooltip invalid>
          Please provide a valid city.
        </CxFormFeedback>
      </CxCol>
      <CxCol md={3} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip04">City</CxFormLabel>
        <CxFormSelect id="validationTooltip04" required>
          <option disabled value="">
            Choose...
          </option>
          <option>...</option>
        </CxFormSelect>
        <CxFormFeedback tooltip invalid>
          Please provide a valid city.
        </CxFormFeedback>
      </CxCol>
      <CxCol md={3} className="position-relative">
        <CxFormLabel htmlFor="validationTooltip05">City</CxFormLabel>
        <CxFormInput type="text" id="validationTooltip05" required />
        <CxFormFeedback tooltip invalid>
          Please provide a valid zip.
        </CxFormFeedback>
      </CxCol>
      <CxCol xs={12} className="position-relative">
        <CxButton context="primary" type="submit">
          Submit form
        </CxButton>
      </CxCol>
    </CxForm>
  )
}
