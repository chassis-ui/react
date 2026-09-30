import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem href="#" active>
        Cras justo odio
      </ListItem>
      <ListItem href="#">Dapibus ac facilisis in</ListItem>
      <ListItem href="#">Morbi leo risus</ListItem>
      <ListItem href="#">Porta ac consectetur ac</ListItem>
      <ListItem href="#" disabled>
        Vestibulum at eros
      </ListItem>
    </List>
  )
}
