import { Avatar, AvatarStack } from '@chassis-ui/react'

export const Example = () => {
  const randomAvatar = () => `https://i.pravatar.cc/256?u=${Math.floor(Math.random() * 64)}`
  return (
    <>
      <AvatarStack
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
        <Avatar component="span">+5</Avatar>
      </AvatarStack>
    </>
  )
}
