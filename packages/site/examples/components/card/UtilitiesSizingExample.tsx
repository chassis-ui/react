import { Button, Card, CardBody, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Card className="w-75">
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            With supporting text below as a natural lead-in to additional content.
          </CardText>
          <Button href="#">Go somewhere</Button>
        </CardBody>
      </Card>
      <Card className="w-50">
        <CardBody>
          <CardTitle>Card title</CardTitle>
          <CardText>
            With supporting text below as a natural lead-in to additional content.
          </CardText>
          <Button href="#">Go somewhere</Button>
        </CardBody>
      </Card>
    </>
  )
}
