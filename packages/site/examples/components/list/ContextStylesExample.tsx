import { Grid, List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Grid columns={1} gap="lg" responsive={{ md: { columns: 2 } }}>
      <div>
        <List color="primary">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </div>
      <div>
        <List color="primary" variant="solid" flush className="rounded">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </div>
      <div>
        <List color="primary" variant="smooth" flush className="rounded">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </div>
      <div>
        <List color="primary" variant="outline">
          <ListItem>Cras justo odio</ListItem>
          <ListItem>Dapibus ac facilisis in</ListItem>
          <ListItem>Vestibulum at eros</ListItem>
        </List>
      </div>
    </Grid>
  )
}
