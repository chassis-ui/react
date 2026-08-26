import { Checkbox, List } from '@chassis-ui/react'

export const Example = () => {
  return (
    <List component="div">
      <Checkbox className="list-item" label="Cras justo odio" />
      <Checkbox className="list-item" label="Dapibus ac facilisis in" defaultSelected />
      <Checkbox className="list-item" label="Morbi leo risus" defaultSelected />
      <Checkbox className="list-item" label="orta ac consectetur ac" />
      <Checkbox className="list-item" label="Vestibulum at eros" />
    </List>
  )
}
