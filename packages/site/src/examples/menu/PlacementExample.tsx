import { Menu } from '@chassis-ui/react'

const placements = ['top', 'bottom', 'left', 'right'] as const

export const Example = () => {
  return (
    <div className="d-flex flex-wrap gap-small">
      {placements.map((placement) => (
        <Menu key={placement} placement={placement}>
          <Menu.Toggle color="secondary">{placement}</Menu.Toggle>
          <Menu.List>
            <Menu.Item href="#">Action</Menu.Item>
            <Menu.Item href="#">Another action</Menu.Item>
            <Menu.Item href="#">Something else here</Menu.Item>
          </Menu.List>
        </Menu>
      ))}
    </div>
  )
}
