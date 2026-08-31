import {
  Card,
  CardBody,
  CardImage,
  CardLink,
  CardText,
  CardTitle,
  List,
  ListItem
} from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card style={{ width: '18rem' }}>
      <CardImage orientation="top" src="https://placehold.co/800x400" />
      <CardBody>
        <CardTitle>Card title</CardTitle>
        <CardText>
          Some quick example text to build on the card title and make up the bulk of the card's
          content.
        </CardText>
      </CardBody>
      <List flush>
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Vestibulum at eros</ListItem>
      </List>
      <CardBody>
        <CardLink href="#">Card link</CardLink>
        <CardLink href="#">Another link</CardLink>
      </CardBody>
    </Card>
  )
}
