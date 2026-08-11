import { useContext } from 'react'
import { ModalContext, ModalContextProps } from '../components/modal/Modal'

export type UseModalResult = ModalContextProps

// Reach the enclosing `Modal`'s close handler from anywhere in its composed markup — e.g. to
// close it from a plain `Button` placed in a `ModalFooter`. Only meaningful inside a `Modal`;
// outside one it returns a no-op `close`.
export const useModal = (): UseModalResult => useContext(ModalContext)
