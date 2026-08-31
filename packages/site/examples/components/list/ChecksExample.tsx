import { Checkbox, List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem>
        <Checkbox label="Cras justo odio" />
      </ListItem>
      <ListItem>
        <Checkbox label="Dapibus ac facilisis in" defaultSelected />
      </ListItem>
      <ListItem>
        <Checkbox label="Morbi leo risus" defaultSelected />
      </ListItem>
      <ListItem>
        <Checkbox label="orta ac consectetur ac" />
      </ListItem>
      <ListItem>
        <Checkbox label="Vestibulum at eros" />
      </ListItem>
    </List>
  )
}
