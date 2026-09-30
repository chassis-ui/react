import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem href="#">Dapibus ac facilisis in</ListItem>
      {(['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const).map((color) => (
        <ListItem href="#" color={color} key={color}>
          A simple {color} list action
        </ListItem>
      ))}
    </List>
  )
}
