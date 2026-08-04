import { useState } from 'react'
import { Card, Button, Col, Collapse, Row } from '@chassis-ui/react'

export const MultipleTargetsExample = () => {
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
        <Col xs={6}>
          <Collapse visible={visibleA}>
            <Card className="mt-3">
              <Card.Body>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </Card.Body>
            </Card>
          </Collapse>
        </Col>
        <Col xs={6}>
          <Collapse visible={visibleB}>
            <Card className="mt-3">
              <Card.Body>
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson
                cred nesciunt sapiente ea proident.
              </Card.Body>
            </Card>
          </Collapse>
        </Col>
      </Row>
    </>
  )
}
