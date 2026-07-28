import {
  CxButton,
  CxCol,
  CxForm,
  CxCheckbox,
  CxTextInput,
  CxFormLabel,
  CxRadio,
  CxRadioGroup,
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
          <CxTextInput type="email" id="inputEmail3" />
        </CxCol>
      </CxRow>
      <CxRow className="mb-medium">
        <CxFormLabel htmlFor="inputPassword3" className="small:col-2 col-form-label">
          Password
        </CxFormLabel>
        <CxCol sm={10}>
          <CxTextInput type="password" id="inputPassword3" />
        </CxCol>
      </CxRow>
      <CxRadioGroup className="row mb-medium" label="Radios" defaultValue="option1">
        <CxCol sm={10}>
          <CxRadio value="option1" label="First radio" />
          <CxRadio value="option2" label="Second radio" />
          <CxRadio value="option3" label="Third disabled radio" disabled />
        </CxCol>
      </CxRadioGroup>
      <CxRow className="mb-medium">
        <div className="small:col-10 small:offset-2">
          <CxCheckbox id="gridCheck1" label="Example checkbox" />
        </div>
      </CxRow>
      <CxButton type="submit">Sign in</CxButton>
    </CxForm>
  )
}
