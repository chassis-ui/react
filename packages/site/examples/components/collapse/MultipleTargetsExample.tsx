import { useState } from 'react'
import { Card, CardBody, Button, Col, Collapse, Row } from '@chassis-ui/react'

export const Example = () => {
  const [visibleA, setVisibleA] = useState(false)
  const [visibleB, setVisibleB] = useState(false)
  return (
    <>
      <Button onClick={() => setVisibleA(!visibleA)}>Toggle first element</Button>
      <Button onClick={() => setVisibleB(!visibleB)}>Toggle second element</Button>
      <Button
        onClick={() => {
          setVisibleA(!visibleA)
          setVisibleB(!visibleB)
        }}
      >
        Toggle both elements
      </Button>
      <Row>
        <Col span={6}>
          <Collapse visible={visibleA}>
            <Card className="mt-3">
              <CardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </CardBody>
            </Card>
          </Collapse>
        </Col>
        <Col span={6}>
          <Collapse visible={visibleB}>
            <Card className="mt-3">
              <CardBody>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </CardBody>
            </Card>
          </Collapse>
        </Col>
      </Row>
    </>
  )
}
