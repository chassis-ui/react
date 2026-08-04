import { CxAvatar, CxAvatarStack } from '@chassis-ui/react'

export const Example = () => {
  const randomAvatar = () => `https://i.pravatar.cc/256?u=${Math.floor(Math.random() * 64)}`
  return (
    <>
      <CxAvatarStack
        items={[
          {
            src: randomAvatar(),
            alt: 'Team member'
          },
          {
            src: randomAvatar(),
            alt: 'Team member'
          },
          {
            src: randomAvatar(),
            alt: 'Team member'
          }
        ]}
      >
        <CxAvatar component="span">+5</CxAvatar>
      </CxAvatarStack>
    </>
  )
}
