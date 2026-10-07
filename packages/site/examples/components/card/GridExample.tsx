import { Button, Card, CardBody, CardText, CardTitle, Grid, GridItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid gap="md">
      <GridItem span={{ base: 'full', sm: 6 }}>
        <Card>
          <CardBody>
            <CardTitle>Special title treatment</CardTitle>
            <CardText>
              With supporting text below as a natural lead-in to additional content.
            </CardText>
            <Button href="#">Go somewhere</Button>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={{ base: 'full', sm: 6 }}>
        <Card>
          <CardBody>
            <CardTitle>Special title treatment</CardTitle>
            <CardText>
              With supporting text below as a natural lead-in to additional content.
            </CardText>
            <Button href="#">Go somewhere</Button>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  )
}
