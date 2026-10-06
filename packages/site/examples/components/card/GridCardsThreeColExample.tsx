import { Card, CardBody, CardFooter, CardImage, CardText, CardTitle, Grid } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={1} gap="md" responsive={{ md: { columns: 3 } }}>
      <div>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
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
      </div>
      <div>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
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
      </div>
      <div>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
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
      </div>
      <div>
        <Card>
          <CardImage orientation="top" src="https://placehold.co/800x400" alt="" />
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
      </div>
    </Grid>
  )
}
