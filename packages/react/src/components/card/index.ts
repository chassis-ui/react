import { Card as CardRoot } from './Card'
import { CardBody } from './CardBody'
import { CardFooter } from './CardFooter'
import { CardGroup } from './CardGroup'
import { CardHeader } from './CardHeader'
import { CardImage } from './CardImage'
import { CardImageOverlay } from './CardImageOverlay'
import { CardLink } from './CardLink'
import { CardSubtitle } from './CardSubtitle'
import { CardText } from './CardText'
import { CardTitle } from './CardTitle'
// plop:sub-import

export const Card = Object.assign(CardRoot, {
  // plop:sub-entry
  Body: CardBody,
  Footer: CardFooter,
  Group: CardGroup,
  Header: CardHeader,
  Image: CardImage,
  ImageOverlay: CardImageOverlay,
  Link: CardLink,
  Subtitle: CardSubtitle,
  Text: CardText,
  Title: CardTitle
})
export type { CardProps } from './Card'
export type { CardBodyProps } from './CardBody'
export type { CardFooterProps } from './CardFooter'
export type { CardGroupProps } from './CardGroup'
export type { CardHeaderProps } from './CardHeader'
export type { CardImageProps } from './CardImage'
export type { CardImageOverlayProps } from './CardImageOverlay'
export type { CardLinkProps } from './CardLink'
export type { CardSubtitleProps } from './CardSubtitle'
export type { CardTextProps } from './CardText'
export type { CardTitleProps } from './CardTitle'
// plop:sub-type
