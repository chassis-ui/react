import { useRef } from 'react'
import { useScrollspy } from '@chassis-ui/react'

const chapters = [
  { id: 'hook-intro', title: 'Introduction' },
  { id: 'hook-usage', title: 'Usage' },
  { id: 'hook-options', title: 'Options' }
]

const text =
  'This is some placeholder content for the useScrollspy example. The line above the box ' +
  'names the chapter being read. It is repeated in every chapter, to give the box enough to ' +
  'scroll.'

export const Example = () => {
  const box = useRef<HTMLDivElement>(null)
  const activeId = useScrollspy(
    chapters.map((chapter) => chapter.id),
    { root: box }
  )
  const active = chapters.find((chapter) => chapter.id === activeId)
  return (
    <>
      <p aria-live="polite">Reading: {active ? active.title : '…'}</p>
      <div
        ref={box}
        role="region"
        aria-label="Chapters"
        tabIndex={0}
        style={{ height: 200, overflowY: 'auto' }}
      >
        {chapters.map((chapter) => (
          <div key={chapter.id} id={chapter.id}>
            <h4>{chapter.title}</h4>
            <p>{text}</p>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </>
  )
}
