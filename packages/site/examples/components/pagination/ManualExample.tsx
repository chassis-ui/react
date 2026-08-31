import { useState } from 'react'
import { Pagination, PaginationItem, usePagination } from '@chassis-ui/react'

// Smart mode always shows a contiguous range around the active page. Manual mode is for sets
// smart mode can't produce — like jumping between a fixed list of bookmarked pages. Prev/Next
// step through the array by index rather than by ±1, since the page numbers themselves aren't
// contiguous.
const bookmarkedPages = [1, 5, 12, 47]

export const Example = () => {
  const [index, setIndex] = useState(0)

  const prevDisabled = index <= 0
  const nextDisabled = index >= bookmarkedPages.length - 1
  const { prevRef, nextRef, handlePrevClick, handleNextClick } = usePagination({
    prevDisabled,
    nextDisabled,
    onPrev: () => setIndex((i) => i - 1),
    onNext: () => setIndex((i) => i + 1)
  })

  return (
    <Pagination aria-label="Bookmarked pages">
      <PaginationItem
        ref={prevRef}
        disabled={prevDisabled}
        onClick={handlePrevClick}
        aria-label="Previous"
      >
        &laquo;
      </PaginationItem>
      {bookmarkedPages.map((p, i) => (
        <PaginationItem key={p} active={i === index} onClick={() => setIndex(i)}>
          {p}
        </PaginationItem>
      ))}
      <PaginationItem
        ref={nextRef}
        disabled={nextDisabled}
        onClick={handleNextClick}
        aria-label="Next"
      >
        &raquo;
      </PaginationItem>
    </Pagination>
  )
}
