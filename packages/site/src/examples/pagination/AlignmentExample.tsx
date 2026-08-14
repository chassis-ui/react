import { Pagination, PaginationItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Pagination align="center" aria-label="Centered pagination">
        <PaginationItem>&laquo;</PaginationItem>
        <PaginationItem>1</PaginationItem>
        <PaginationItem active>2</PaginationItem>
        <PaginationItem>3</PaginationItem>
        <PaginationItem>&raquo;</PaginationItem>
      </Pagination>
      <Pagination align="end" aria-label="Right-aligned pagination">
        <PaginationItem>&laquo;</PaginationItem>
        <PaginationItem>1</PaginationItem>
        <PaginationItem active>2</PaginationItem>
        <PaginationItem>3</PaginationItem>
        <PaginationItem>&raquo;</PaginationItem>
      </Pagination>
    </>
  )
}
