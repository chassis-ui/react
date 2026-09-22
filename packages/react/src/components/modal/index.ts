'use client'

import '../../utils/suppressFocusRingGlobally'

export { Modal } from './Modal'
export type { ModalProps } from './Modal'
export { ModalBody } from './ModalBody'
export type { ModalBodyProps } from './ModalBody'
export { ModalFooter } from './ModalFooter'
export type { ModalFooterProps } from './ModalFooter'
export { ModalHeader } from './ModalHeader'
export type { ModalHeaderProps } from './ModalHeader'
export { ModalTitle } from './ModalTitle'
export type { ModalTitleProps } from './ModalTitle'
// Also exported from the package root; repeated here so this folder's subpath entry
// (`@chassis-ui/react/<folder>`) covers the whole family without reaching back to the root.
export { useModal } from '../../hooks/useModal'
export type { UseModalResult } from '../../hooks/useModal'
