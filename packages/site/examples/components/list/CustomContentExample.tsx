import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem component="a" href="#" active>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List item heading</h5>
          <sm>3 days ago</sm>
        </div>
        <p className="mb-1">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <sm>Donec id elit non mi porta.</sm>
      </ListItem>
      <ListItem component="a" href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List item heading</h5>
          <sm className="md:text-emphasis">3 days ago</sm>
        </div>
        <p className="mb-1">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <sm className="md:text-emphasis">Donec id elit non mi porta.</sm>
      </ListItem>
      <ListItem component="a" href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List item heading</h5>
          <sm className="md:text-emphasis">3 days ago</sm>
        </div>
        <p className="mb-1">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <sm className="md:text-emphasis">Donec id elit non mi porta.</sm>
      </ListItem>
    </List>
  )
}
