import { Modal as ModalRoot } from './Modal'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'
import { ModalHeader } from './ModalHeader'
import { ModalTitle } from './ModalTitle'
// plop:sub-import

export const Modal = Object.assign(ModalRoot, {
  // plop:sub-entry
  Body: ModalBody,
  Footer: ModalFooter,
  Header: ModalHeader,
  Title: ModalTitle
})
export type { ModalProps } from './Modal'
export type { ModalBodyProps } from './ModalBody'
export type { ModalFooterProps } from './ModalFooter'
export type { ModalHeaderProps } from './ModalHeader'
export type { ModalTitleProps } from './ModalTitle'
// plop:sub-type
