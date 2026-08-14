import { Pagination, PaginationItem } from '@chassis-ui/react'

// Freeze every item as `disabled` while the paginated data is fetching, so the paginator
// visibly reflects the loading state instead of accepting clicks that only queue up once the
// fetch resolves.
export const Example = () => {
  return (
    <Pagination aria-label="Page navigation example" aria-busy="true">
      <PaginationItem aria-label="Previous" disabled>
        &laquo;
      </PaginationItem>
      <PaginationItem active disabled>
        1
      </PaginationItem>
      <PaginationItem disabled>2</PaginationItem>
      <PaginationItem disabled>3</PaginationItem>
      <PaginationItem aria-label="Next" disabled>
        &raquo;
      </PaginationItem>
    </Pagination>
  )
}
