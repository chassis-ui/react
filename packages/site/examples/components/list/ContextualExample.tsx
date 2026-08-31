import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem>Dapibus ac facilisis in</ListItem>
      {(['primary', 'secondary', 'success', 'danger', 'warning', 'info'] as const).map(
        (color, index) => (
          <ListItem color={color} key={index}>
            A simple {color} list item
          </ListItem>
        )
      )}
    </List>
  )
}
