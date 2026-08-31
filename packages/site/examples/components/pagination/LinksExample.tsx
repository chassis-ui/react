import { Pagination, PaginationItem } from '@chassis-ui/react'

// Smart mode always renders buttons wired to `onActivePageChange`. Pass `href` directly to
// `PaginationItem` for real anchors instead — e.g. server-rendered pages where each link is a
// full page load to `?page=N`. (Hrefs point to `#` here so the docs page itself doesn't
// navigate; swap in your real page URLs.)
export const Example = () => {
  return (
    <Pagination aria-label="Page navigation example">
      <PaginationItem href="#" aria-label="Previous" disabled>
        &laquo;
      </PaginationItem>
      <PaginationItem href="#" active>
        1
      </PaginationItem>
      <PaginationItem href="#">2</PaginationItem>
      <PaginationItem href="#">3</PaginationItem>
      <PaginationItem href="#" aria-label="Next">
        &raquo;
      </PaginationItem>
    </Pagination>
  )
}
