import { Progress as ProgressRoot } from './Progress'
import { ProgressBar } from './ProgressBar'
// plop:sub-import

export const Progress = Object.assign(ProgressRoot, {
  // plop:sub-entry
  Bar: ProgressBar
})
export type { ProgressProps } from './Progress'
export type { ProgressBarProps } from './ProgressBar'
// plop:sub-type
