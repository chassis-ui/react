import { CxAvatarStack } from '@chassis-ui/react'

export const Example = () => {
  const randomAvatar = () => `https://i.pravatar.cc/256?u=${Math.floor(Math.random() * 64)}`
  return (
    <>
      <CxAvatarStack
        size="small"
        items={[
          {
            content: '+5',
            component: 'span'
          },
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
      ></CxAvatarStack>
    </>
  )
}
