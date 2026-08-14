import { Pagination, PaginationItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Pagination size="large" aria-label="Large pagination example">
        <PaginationItem>&laquo;</PaginationItem>
        <PaginationItem>1</PaginationItem>
        <PaginationItem active>2</PaginationItem>
        <PaginationItem>3</PaginationItem>
        <PaginationItem>&raquo;</PaginationItem>
      </Pagination>
      <Pagination size="small" aria-label="Small pagination example">
        <PaginationItem>&laquo;</PaginationItem>
        <PaginationItem>1</PaginationItem>
        <PaginationItem active>2</PaginationItem>
        <PaginationItem>3</PaginationItem>
        <PaginationItem>&raquo;</PaginationItem>
      </Pagination>
    </>
  )
}
