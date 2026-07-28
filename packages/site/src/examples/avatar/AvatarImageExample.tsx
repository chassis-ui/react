import { CxAvatar, CxAvatarImage } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxAvatar>
        <CxAvatarImage src="https://i.pravatar.cc/256" alt="Profile picture" loading="lazy" />
      </CxAvatar>
    </>
  )
}
