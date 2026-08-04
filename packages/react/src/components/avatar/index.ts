import { Avatar as AvatarRoot } from './Avatar'
import { AvatarImage } from './AvatarImage'
import { AvatarStack } from './AvatarStack'
// plop:sub-import

export const Avatar = Object.assign(AvatarRoot, {
  // plop:sub-entry
  Image: AvatarImage,
  Stack: AvatarStack
})
export type { AvatarProps } from './Avatar'
export type { AvatarImageProps } from './AvatarImage'
export type { AvatarStackProps, AvatarStackItemDef } from './AvatarStack'
// plop:sub-type
