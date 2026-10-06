import { List, ListItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List>
      <ListItem href="#" active>
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-xs">List item heading</h5>
          <small>3 days ago</small>
        </div>
        <p className="mb-xs">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <small>Donec id elit non mi porta.</small>
      </ListItem>
      <ListItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-xs">List item heading</h5>
          <small className="fg-subtle">3 days ago</small>
        </div>
        <p className="mb-xs">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <small className="fg-subtle">Donec id elit non mi porta.</small>
      </ListItem>
      <ListItem href="#">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-xs">List item heading</h5>
          <small className="fg-subtle">3 days ago</small>
        </div>
        <p className="mb-xs">
          Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius
          blandit.
        </p>
        <small className="fg-subtle">Donec id elit non mi porta.</small>
      </ListItem>
    </List>
  )
}
