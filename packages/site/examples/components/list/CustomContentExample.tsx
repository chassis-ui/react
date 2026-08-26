import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem component="a" href="#" active>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List item heading</h5>
          <small>3 days ago</small>
        </div>
        <p className="mb-1">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <small>Donec id elit non mi porta.</small>
      </ListItem>
      <ListItem component="a" href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List item heading</h5>
          <small className="medium:text-emphasis">3 days ago</small>
        </div>
        <p className="mb-1">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <small className="medium:text-emphasis">Donec id elit non mi porta.</small>
      </ListItem>
      <ListItem component="a" href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">List item heading</h5>
          <small className="medium:text-emphasis">3 days ago</small>
        </div>
        <p className="mb-1">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <small className="medium:text-emphasis">Donec id elit non mi porta.</small>
      </ListItem>
    </List>
  )
}
