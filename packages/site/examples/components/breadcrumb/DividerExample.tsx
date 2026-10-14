import { Breadcrumb, BreadcrumbItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Breadcrumb style={{ '--cx-breadcrumb-divider': "'>'" } as React.CSSProperties}>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem active>Library</BreadcrumbItem>
    </Breadcrumb>
  )
}
