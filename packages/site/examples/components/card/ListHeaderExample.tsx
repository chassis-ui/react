import { Card, CardHeader, List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Card style={{ width: '18rem' }}>
      <CardHeader>Header</CardHeader>
      <List flush>
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Vestibulum at eros</ListItem>
      </List>
    </Card>
  )
}
