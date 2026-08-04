import { Accordion as AccordionRoot } from './Accordion'
import { AccordionBody } from './AccordionBody'
import { AccordionButton } from './AccordionButton'
import { AccordionCollapse } from './AccordionCollapse'
import { AccordionHeader } from './AccordionHeader'
import { AccordionItem } from './AccordionItem'
// plop:sub-import

export const Accordion = Object.assign(AccordionRoot, {
  // plop:sub-entry
  Body: AccordionBody,
  Button: AccordionButton,
  Collapse: AccordionCollapse,
  Header: AccordionHeader,
  Item: AccordionItem
})
export type { AccordionProps, AccordionItemDef } from './Accordion'
export type { AccordionBodyProps } from './AccordionBody'
export type { AccordionButtonProps } from './AccordionButton'
export type { AccordionHeaderProps } from './AccordionHeader'
export type { AccordionItemProps } from './AccordionItem'
// plop:sub-type
