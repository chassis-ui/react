import { Col, FormLabel, Row, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Row className="mb-md">
        <FormLabel htmlFor="colFormLabelSm" className="sm:col-2 col-form-label col-form-label-sm">
          Email
        </FormLabel>
        <Col responsive={{ sm: { span: 10 } }}>
          <TextInput
            type="email"
            className="form-input sm"
            id="colFormLabelSm"
            placeholder="col-form-label-sm"
          />
        </Col>
      </Row>
      <Row className="mb-md">
        <FormLabel htmlFor="colFormLabel" className="sm:col-2 col-form-label">
          Email
        </FormLabel>
        <Col responsive={{ sm: { span: 10 } }}>
          <TextInput type="email" id="colFormLabel" placeholder="col-form-label" />
        </Col>
      </Row>
      <Row>
        <FormLabel htmlFor="colFormLabelLg" className="sm:col-2 col-form-label col-form-label-lg">
          Email
        </FormLabel>
        <Col responsive={{ sm: { span: 10 } }}>
          <TextInput
            type="email"
            className="form-input lg"
            id="colFormLabelLg"
            placeholder="col-form-label-lg"
          />
        </Col>
      </Row>
    </>
  )
}
