import { Col, FormLabel, Row, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Row className="mb-medium">
        <FormLabel
          htmlFor="colFormLabelSm"
          className="small:col-2 col-form-label col-form-label-small"
        >
          Email
        </FormLabel>
        <Col responsive={{ small: { span: 10 } }}>
          <TextInput
            type="email"
            className="form-input small"
            id="colFormLabelSm"
            placeholder="col-form-label-small"
          />
        </Col>
      </Row>
      <Row className="mb-medium">
        <FormLabel htmlFor="colFormLabel" className="small:col-2 col-form-label">
          Email
        </FormLabel>
        <Col responsive={{ small: { span: 10 } }}>
          <TextInput type="email" id="colFormLabel" placeholder="col-form-label" />
        </Col>
      </Row>
      <Row>
        <FormLabel
          htmlFor="colFormLabelLg"
          className="small:col-2 col-form-label col-form-label-large"
        >
          Email
        </FormLabel>
        <Col responsive={{ small: { span: 10 } }}>
          <TextInput
            type="email"
            className="form-input large"
            id="colFormLabelLg"
            placeholder="col-form-label-large"
          />
        </Col>
      </Row>
    </>
  )
}
