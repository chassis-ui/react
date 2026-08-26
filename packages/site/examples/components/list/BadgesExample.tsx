import { Badge, List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem className="d-flex justify-content-between align-items-center">
        Cras justo odio
        <Badge color="primary" className="rounded-full">
          14
        </Badge>
      </ListItem>
      <ListItem className="d-flex justify-content-between align-items-center">
        Dapibus ac facilisis in
        <Badge color="primary" className="rounded-full">
          2
        </Badge>
      </ListItem>
      <ListItem className="d-flex justify-content-between align-items-center">
        Morbi leo risus
        <Badge color="primary" className="rounded-full">
          1
        </Badge>
      </ListItem>
    </List>
  )
}
