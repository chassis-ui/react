import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem component="button" active>
        Cras justo odio
      </ListItem>
      <ListItem component="button">Dapibus ac facilisis in</ListItem>
      <ListItem component="button">Morbi leo risus</ListItem>
      <ListItem component="button">Porta ac consectetur ac</ListItem>
      <ListItem component="button" disabled>
        Vestibulum at eros
      </ListItem>
    </List>
  )
}
