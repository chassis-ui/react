import { Card, CardBody, CardFooter, CardHeader, CardText, CardTitle } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Card className="border-primary mb-medium" style={{ maxWidth: '18rem' }}>
        <CardHeader className="primary-bg-evident">Header</CardHeader>
        <CardBody className="primary-bg-main">
          <CardTitle>Primary background</CardTitle>
          <CardText>
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </CardText>
        </CardBody>
        <CardFooter className="primary-bg-even">Footer</CardFooter>
      </Card>
      <Card style={{ maxWidth: '18rem' }}>
        <CardHeader className="fg-primary border-primary">Header</CardHeader>
        <CardBody className="fg-secondary">
          <CardTitle>Custom text color</CardTitle>
          <CardText>
            Some quick example text to build on the card title and make up the bulk of the card's
            content.
          </CardText>
        </CardBody>
        <CardFooter className="fg-subtle primary-border-main">Footer</CardFooter>
      </Card>
    </>
  )
}
