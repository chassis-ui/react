import { Card, CardBody, CardImage, CardText, CardTitle, Grid } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={{ base: 1, md: 3 }} gap="md">
      <div>
        <Card className="h-100">
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
          </CardBody>
        </Card>
      </div>
      <div>
        <Card className="h-100">
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This card has supporting text below as a natural lead-in to additional content.
            </CardText>
          </CardBody>
        </Card>
      </div>
      <div>
        <Card className="h-100">
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This card has even longer content than the first to show that equal height
              action.
            </CardText>
          </CardBody>
        </Card>
      </div>
      <div>
        <Card className="h-100">
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardText>
              This is a wider card with supporting text below as a natural lead-in to additional
              content. This content is a little bit longer.
            </CardText>
          </CardBody>
        </Card>
      </div>
    </Grid>
  )
}
