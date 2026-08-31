import { useState } from 'react'
import { Chip, CloseButton } from '@chassis-ui/react'

export const Example = () => {
  const [tags, setTags] = useState(['React', 'TypeScript', 'CSS'])

  return (
    <>
      {tags.map((tag) => (
        <Chip key={tag} color="primary">
          {tag}
          <CloseButton
            label={`Remove ${tag}`}
            onClick={() => setTags((current) => current.filter((value) => value !== tag))}
          />
        </Chip>
      ))}
    </>
  )
}
