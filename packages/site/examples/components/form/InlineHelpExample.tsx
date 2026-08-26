import { Col, FormHelp, FormLabel, Row, TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Row className="g-3 align-items-center">
      <Col span="auto">
        <FormLabel htmlFor="inputPassword6" className="col-form-label">
          Password
        </FormLabel>
      </Col>
      <Col span="auto">
        <TextInput type="password" id="inputPassword6" aria-describedby="passwordHelpInline" />
      </Col>
      <Col span="auto">
        <FormHelp component="span" id="passwordHelpInline">
          Must be 8-20 characters long.
        </FormHelp>
      </Col>
    </Row>
  )
}
