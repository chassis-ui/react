import { Breadcrumb, BreadcrumbItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem active>Home</BreadcrumbItem>
      </Breadcrumb>

      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem active>Library</BreadcrumbItem>
      </Breadcrumb>

      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Library</BreadcrumbItem>
        <BreadcrumbItem active>Data</BreadcrumbItem>
      </Breadcrumb>
    </>
  )
}
