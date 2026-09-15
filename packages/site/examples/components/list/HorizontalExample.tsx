import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <div className="contains-inline">
      <List className="mb-md" layout="horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
      <List className="mb-md" layout="sm:horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
      <List className="mb-md" layout="md:horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
      <List layout="lg:horizontal">
        <ListItem>Cras justo odio</ListItem>
        <ListItem>Dapibus ac facilisis in</ListItem>
        <ListItem>Morbi leo risus</ListItem>
      </List>
    </div>
  )
}
