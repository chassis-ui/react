import { Pagination, PaginationItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Pagination aria-label="Page navigation example">
      <PaginationItem aria-label="Previous">&laquo;</PaginationItem>
      <PaginationItem>1</PaginationItem>
      <PaginationItem active>2</PaginationItem>
      <PaginationItem>3</PaginationItem>
      <PaginationItem aria-label="Next">&raquo;</PaginationItem>
    </Pagination>
  )
}
