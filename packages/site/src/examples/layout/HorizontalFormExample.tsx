import {
  CxButton,
  Col,
  CxForm,
  CxCheckbox,
  CxTextInput,
  CxFormLabel,
  CxRadio,
  CxRadioGroup,
  Row
} from '@chassis-ui/react'

export const HorizontalFormExample = () => {
  return (
    <CxForm>
      <Row className="mb-medium">
        <CxFormLabel htmlFor="inputEmail3" className="small:col-2 col-form-label">
          Email
        </CxFormLabel>
        <Col sm={10}>
          <CxTextInput type="email" id="inputEmail3" />
        </Col>
      </Row>
      <Row className="mb-medium">
        <CxFormLabel htmlFor="inputPassword3" className="small:col-2 col-form-label">
          Password
        </CxFormLabel>
        <Col sm={10}>
          <CxTextInput type="password" id="inputPassword3" />
        </Col>
      </Row>
      <CxRadioGroup className="row mb-medium" label="Radios" defaultValue="option1">
        <Col sm={10}>
          <CxRadio value="option1" label="First radio" />
          <CxRadio value="option2" label="Second radio" />
          <CxRadio value="option3" label="Third disabled radio" disabled />
        </Col>
      </CxRadioGroup>
      <Row className="mb-medium">
        <div className="small:col-10 small:offset-2">
          <CxCheckbox id="gridCheck1" label="Example checkbox" />
        </div>
      </Row>
      <CxButton type="submit">Sign in</CxButton>
    </CxForm>
  )
}
