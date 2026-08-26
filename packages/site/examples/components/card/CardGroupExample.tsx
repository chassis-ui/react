import { Card, CardBody, CardGroup, CardImage, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="contains-inline">
      <CardGroup>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
            <CardText>
              <small className="fg-subtle">Last updated 3 mins ago</small>
            </CardText>
          </CardBody>
        </Card>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This card has supporting text below as a natural lead-in to additional content.
            </CardText>
            <CardText>
              <small className="fg-subtle">Last updated 3 mins ago</small>
            </CardText>
          </CardBody>
        </Card>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This card has even longer content than the first to show that equal height
              action.
            </CardText>
            <CardText>
              <small className="fg-subtle">Last updated 3 mins ago</small>
            </CardText>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  )
}
