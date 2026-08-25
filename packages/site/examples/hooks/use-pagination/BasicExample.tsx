import { useState } from 'react'
import { Button, usePagination } from '@chassis-ui/react'

export const Example = () => {
  const totalPages = 3
  const [page, setPage] = useState(1)
  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  const { prevRef, nextRef, handlePrevClick, handleNextClick } = usePagination<HTMLButtonElement>({
    prevDisabled,
    nextDisabled,
    onPrev: () => setPage((p) => p - 1),
    onNext: () => setPage((p) => p + 1)
  })

  return (
    <div className="d-flex align-items-center gap-medium">
      <Button ref={prevRef} disabled={prevDisabled} onClick={handlePrevClick}>
        Previous
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button ref={nextRef} disabled={nextDisabled} onClick={handleNextClick}>
        Next
      </Button>
    </div>
  )
}
