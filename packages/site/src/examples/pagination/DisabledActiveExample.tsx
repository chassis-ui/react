import { Pagination, PaginationItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Pagination aria-label="...">
      <PaginationItem disabled>&laquo;</PaginationItem>
      <PaginationItem active>1</PaginationItem>
      <PaginationItem>2</PaginationItem>
      <PaginationItem>3</PaginationItem>
      <PaginationItem>&raquo;</PaginationItem>
    </Pagination>
  )
}
