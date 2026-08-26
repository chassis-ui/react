import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem component="a" href="#" active>
        Cras justo odio
      </ListItem>
      <ListItem component="a" href="#">
        Dapibus ac facilisis in
      </ListItem>
      <ListItem component="a" href="#">
        Morbi leo risus
      </ListItem>
      <ListItem component="a" href="#">
        Porta ac consectetur ac
      </ListItem>
      <ListItem component="a" href="#" disabled>
        Vestibulum at eros
      </ListItem>
    </List>
  )
}
