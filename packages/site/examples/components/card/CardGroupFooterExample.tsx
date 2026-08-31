import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardImage,
  CardText,
  CardTitle
} from '@chassis-ui/react'

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
          </CardBody>
          <CardFooter>
            <small className="fg-subtle">Last updated 3 mins ago</small>
          </CardFooter>
        </Card>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This card has supporting text below as a natural lead-in to additional content.
            </CardText>
          </CardBody>
          <CardFooter>
            <small className="fg-subtle">Last updated 3 mins ago</small>
          </CardFooter>
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
          </CardBody>
          <CardFooter>
            <small className="fg-subtle">Last updated 3 mins ago</small>
          </CardFooter>
        </Card>
      </CardGroup>
    </div>
  )
}
