import { CxMenu, CxMenuToggle, CxMenuList, CxMenuItem } from '@chassis-ui/react'

const placements = ['top', 'bottom', 'left', 'right'] as const

export const PlacementExample = () => {
  return (
    <div className="d-flex flex-wrap gap-small">
      {placements.map((placement) => (
        <CxMenu key={placement} placement={placement}>
          <CxMenuToggle context="secondary">{placement}</CxMenuToggle>
          <CxMenuList>
            <CxMenuItem href="#">Action</CxMenuItem>
            <CxMenuItem href="#">Another action</CxMenuItem>
            <CxMenuItem href="#">Something else here</CxMenuItem>
          </CxMenuList>
        </CxMenu>
      ))}
    </div>
  )
}
