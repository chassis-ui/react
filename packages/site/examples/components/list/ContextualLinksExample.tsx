import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem component="a" href="#">
        Dapibus ac facilisis in
      </ListItem>
      {(['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const).map(
        (color, index) => (
          <ListItem component="a" href="#" color={color} key={index}>
            A simple {color} list action
          </ListItem>
        )
      )}
    </List>
  )
}
