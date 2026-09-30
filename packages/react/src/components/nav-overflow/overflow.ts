// Which items go into the menu, from widths `NavOverflow` has read with every item shown.

export interface MeasuredItem {
  /**
   * Unset for an item that registered nothing, which can't be moved.
   */
  id?: string
  /**
   * Stays in the list whatever the width: marked to keep, active, focused, or with no link for
   * the menu to show.
   */
  keep: boolean
  width: number
}

export interface Measurement {
  /**
   * The width the items have to fit in.
   */
  available: number
  /**
   * The wrapper is narrower than `collapseBelow`.
   */
  collapseAll: boolean
  gap: number
  /**
   * In document order, without the toggle item.
   */
  items: MeasuredItem[]
  /**
   * The width of the toggle item.
   */
  more: number
  /**
   * The fewest items to leave in the list.
   */
  threshold: number
}

// A pixel of slack for sub-pixel layout: `offsetWidth` is rounded.
const SLACK = 1

export function overflowingIds({
  available,
  collapseAll,
  gap,
  items,
  more,
  threshold
}: Measurement): string[] {
  const movable = items.filter((item) => !item.keep)
  const ids = (overflowing: MeasuredItem[]) => overflowing.map((item) => item.id as string)

  if (collapseAll) return ids(movable)

  // Everything fits without the toggle, which then isn't shown. chassis-css's plugin always
  // reserves the toggle's width, and so moves the last item of a list that fits exactly.
  const total = items.reduce((sum, item) => sum + item.width, 0) + gap * (items.length - 1)
  if (total <= available + SLACK) return []

  // The toggle and the kept items are shown whatever happens, each with the gap to the next.
  let used = more + items.reduce((sum, item) => (item.keep ? sum + item.width + gap : sum), 0)
  let overflowing = movable.filter((item) => {
    used += item.width + gap
    return used > available + SLACK
  })

  if (items.length - overflowing.length < threshold && items.length > threshold) {
    overflowing = items.slice(threshold).filter((item) => !item.keep)
  }

  return ids(overflowing)
}
