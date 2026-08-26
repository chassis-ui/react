import { useState, type ChangeEvent } from 'react'
import { Button, Icon, Select, usePagination } from '@chassis-ui/react'

export const Example = () => {
  const total = 100
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages
  const { prevRef, nextRef, handlePrevClick, handleNextClick } = usePagination<HTMLButtonElement>({
    prevDisabled,
    nextDisabled,
    onPrev: () => setPage((p) => p - 1),
    onNext: () => setPage((p) => p + 1)
  })

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  return (
    <div className="d-flex align-items-center justify-content-between gap-3">
      <div className="d-flex flex-fill gap-xsmall">
        <label htmlFor="compact-pg-size" className="mb-0">
          Items per page:
        </label>
        <Select
          id="compact-pg-size"
          size="small"
          className="w-auto"
          value={String(pageSize)}
          onChange={handlePageSizeChange}
          options={[
            { label: '10', value: '10' },
            { label: '25', value: '25' },
            { label: '50', value: '50' }
          ]}
        />
      </div>
      <small className="fg-subtle">{`${start}-${end} of ${total}`}</small>
      <div className="d-flex flex-fill gap-xsmall justify-content-end">
        <Button
          ref={prevRef}
          className="icon-only"
          size="small"
          disabled={prevDisabled}
          onClick={handlePrevClick}
        >
          <Icon name="chevron-left-solid" className="directional-icon" />
          <span className="visually-hidden">Previous page</span>
        </Button>
        <Select
          aria-label="Current page"
          size="small"
          className="w-auto"
          value={String(page)}
          onChange={(e) => setPage(Number(e.target.value))}
          options={Array.from({ length: totalPages }, (_, i) => ({
            label: String(i + 1),
            value: String(i + 1)
          }))}
        />
        <Button
          ref={nextRef}
          className="icon-only"
          size="small"
          disabled={nextDisabled}
          onClick={handleNextClick}
        >
          <Icon name="chevron-right-solid" className="directional-icon" />
          <span className="visually-hidden">Next page</span>
        </Button>
      </div>
    </div>
  )
}
