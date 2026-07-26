import React from 'react'
import {
  CxButton,
  CxCol,
  CxForm,
  CxFormCheck,
  CxFormInput,
  CxFormLabel,
  CxFormRadio,
  CxFormRadioGroup,
  CxRow
} from '@chassis-ui/react'

export const HorizontalFormExample = () => {
  return (
    <CxForm>
      <CxRow className="mb-medium">
        <CxFormLabel htmlFor="inputEmail3" className="small:col-2 col-form-label">
          Email
        </CxFormLabel>
        <CxCol sm={10}>
          <CxFormInput type="email" id="inputEmail3" />
        </CxCol>
      </CxRow>
      <CxRow className="mb-medium">
        <CxFormLabel htmlFor="inputPassword3" className="small:col-2 col-form-label">
          Password
        </CxFormLabel>
        <CxCol sm={10}>
          <CxFormInput type="password" id="inputPassword3" />
        </CxCol>
      </CxRow>
      <CxFormRadioGroup className="row mb-medium" label="Radios" defaultValue="option1">
        <CxCol sm={10}>
          <CxFormRadio value="option1" label="First radio" />
          <CxFormRadio value="option2" label="Second radio" />
          <CxFormRadio value="option3" label="Third disabled radio" disabled />
        </CxCol>
      </CxFormRadioGroup>
      <CxRow className="mb-medium">
        <div className="small:col-10 small:offset-2">
          <CxFormCheck id="gridCheck1" label="Example checkbox" />
        </div>
      </CxRow>
      <CxButton type="submit">Sign in</CxButton>
    </CxForm>
  )
}
