import { Col, List, ListItem, Row } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Row className="medium:row-cols-2 g-large">
      <Col>
        <List color="primary">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </Col>
      <Col>
        <List color="primary" variant="solid" flush className="rounded">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </Col>
      <Col>
        <List color="primary" variant="smooth" flush className="rounded">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </Col>
      <Col>
        <List color="primary" variant="outline">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </Col>
    </Row>
  )
}
