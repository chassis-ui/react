import {
  Card,
  CardBody,
  CardFooter,
  CardImage,
  CardText,
  CardTitle,
  Col,
  Row
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Row cols={1} gutter="medium" responsive={{ medium: { cols: 3 } }}>
      <Col span>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
          </CardBody>
          <CardFooter>
            <small className="medium:text-emphasis">Last updated 3 mins ago</small>
          </CardFooter>
        </Card>
      </Col>
      <Col span>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
          </CardBody>
          <CardFooter>
            <small className="medium:text-emphasis">Last updated 3 mins ago</small>
          </CardFooter>
        </Card>
      </Col>
      <Col span>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
          </CardBody>
          <CardFooter>
            <small className="medium:text-emphasis">Last updated 3 mins ago</small>
          </CardFooter>
        </Card>
      </Col>
      <Col span>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
          </CardBody>
          <CardFooter>
            <small className="medium:text-emphasis">Last updated 3 mins ago</small>
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
}
