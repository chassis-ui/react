import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="contains-inline">
      <List className="mb-medium" layout="horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
      <List className="mb-medium" layout="small:horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
      <List className="mb-medium" layout="medium:horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
      <List layout="large:horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
    </div>
  )
}
