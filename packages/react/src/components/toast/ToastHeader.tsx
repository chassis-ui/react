import React, {
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  ReactElement,
  ReactNode
} from 'react'
import classNames from 'classnames'

import { CloseButton } from '../close-button/CloseButton'
import { useToast } from '../../hooks'
import { PolymorphicComponentProps, PolymorphicRef } from '../../utils/polymorphic'
import { ToastIcon } from './ToastIcon'

type ToastHeaderOwnProps<C extends ElementType> = {
  /**
   * Heading, rendered before `time` as a `<strong>`.
   */
  children?: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Automatically add a close button to the header.
   */
  closeButton?: boolean
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Leading icon. A string is rendered as `<ToastIcon name={icon} />`; pass any other node
   * for a fully custom icon (typically a logo or avatar). Hidden from assistive technology by
   * default, since it duplicates the heading visually.
   */
  icon?: string | ReactNode
  /**
   * Trailing timestamp, rendered after the heading.
   */
  time?: ReactNode
  /**
   * Sets the `id` on the rendered heading element, for `aria-labelledby` wiring. Set
   * automatically by `Toast` when both `title` and `message` are used together; only needed
   * here for manual wiring in a fully custom composition.
   */
  titleId?: string
}

export type ToastHeaderProps<C extends ElementType = 'div'> = PolymorphicComponentProps<
  C,
  ToastHeaderOwnProps<C>
>

type ToastHeaderComponent = (<C extends ElementType = 'div'>(
  props: ToastHeaderProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ToastHeaderRender<C extends ElementType = 'div'>(
  {
    children,
    className,
    closeButton,
    closeLabel,
    component,
    icon,
    time,
    titleId,
    ...rest
  }: ToastHeaderProps<C>,
  ref: PolymorphicRef<C>
) {
  const { close } = useToast()
  const Component = component || 'div'
  const _className = classNames('toast-header', className)
  return (
    <Component className={_className} {...rest} ref={ref}>
      {icon != null && (
        <span aria-hidden="true" className="me-small">
          {typeof icon === 'string' ? <ToastIcon name={icon} /> : icon}
        </span>
      )}
      {children != null && (
        <strong id={titleId} className="me-auto">
          {children}
        </strong>
      )}
      {time != null && <small>{time}</small>}
      {closeButton && <CloseButton label={closeLabel} onClick={close} />}
    </Component>
  )
}

export const ToastHeader = forwardRef(
  ToastHeaderRender as ForwardRefRenderFunction<Element, ToastHeaderProps<ElementType>>
) as ToastHeaderComponent

ToastHeader.displayName = 'ToastHeader'
