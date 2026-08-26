import { Breadcrumb, BreadcrumbItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Breadcrumb style={{ '--cui-breadcrumb-divider': "'>'" } as React.CSSProperties}>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem active>Library</BreadcrumbItem>
    </Breadcrumb>
  )
}
