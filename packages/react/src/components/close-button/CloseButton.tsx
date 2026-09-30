import React, {
  ElementType,
  ForwardRefRenderFunction,
  MouseEventHandler,
  ReactElement,
  Ref
} from 'react'
import classNames from 'classnames'
import { mergeProps } from 'react-aria'

import { ContextColor, ContextStyle } from '../../types'
import { useButtonSemantics, useDisabledAnchorGuard } from '../../hooks'
import { hrefProps, linkElement, resolveLinkKind } from '../../utils/elementKind'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef,
  PolymorphicRefWithFallback
} from '../../utils/polymorphic'

type CloseButtonOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors. Applies the
   * `context` class alongside it, so the icon picks up that color without needing
   * an ancestor `.context` wrapper.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * A custom HTML tag (e.g. `'span'`) gets button semantics — role, focus, Enter/Space
   * activation — filled in automatically. A component is trusted to handle its own semantics,
   * so pass one that's already interactive (e.g. `Button`).
   */
  component?: C
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The href attribute specifies the URL of the page the link goes to. Renders an `<a>` in place
   * of the `<button>`, unless `component` or `asChild` chose the element.
   */
  href?: string
  /**
   * The accessible label announced by assistive technology. Override this to
   * localize the button for non-English contexts.
   */
  label?: string
  /**
   * Fires on click. Typed for every element `component` can actually render (`button` or `a`
   * natively, plus whatever a custom `component` renders), rather than narrowed to
   * `HTMLButtonElement` alone.
   */
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
  /**
   * Specifies the type of button. Always specify the type attribute for the `<button>` element.
   * Different browsers may use different default types for the `<button>` element.
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Set the close button's context style variant. Applies the `context` class
   * alongside it, same as `color`.
   */
  variant?: ContextStyle
}

export type CloseButtonProps<C extends ElementType = 'button'> = PolymorphicComponentProps<
  C,
  CloseButtonOwnProps<C>
>

type CloseButtonComponent = (<C extends ElementType = 'button'>(
  props: CloseButtonProps<C> & {
    ref?: PolymorphicRefWithFallback<C, HTMLButtonElement | HTMLAnchorElement>
  }
) => ReactElement | null) & { displayName?: string }

function CloseButtonRender<C extends ElementType = 'button'>(
  {
    children,
    className,
    color,
    component,
    disabled,
    href,
    label,
    onClick,
    size,
    type = 'button',
    variant,
    ...rest
  }: CloseButtonProps<C>,
  ref: PolymorphicRef<C>
) {
  // `href` makes it an `<a>`, unless `component` or `asChild` chose the element (see
  // `linkElement`). It used to be dropped unless `component="a"` was passed as well.
  const component_ = linkElement(component, href, 'button')
  // The kind rather than the tag, counting a router link with `href` or `to` as an anchor: under `asChild`, `component_` is a `Slot` standing in for the
  // caller's element, and a slotted `<a>` needs what `component="a"` gets.
  const kind = resolveLinkKind(component_, href, rest)
  const linkProps = hrefProps(kind, href, 'CloseButton')

  // A component reference (e.g. `Button`) has its own visual identity and its own
  // `color`/`size`/`variant` semantics — CloseButton's icon styling (the `close-button`
  // class and its context/color/variant/size classes) would just conflict with it, and
  // would also swallow those props before the component ever saw them. So a component
  // reference gets none of CloseButton's own styling; `color`/`size`/`variant` pass
  // through untouched, same as `className`, letting the component interpret them itself.
  const isComponentReference = kind === 'component'

  // Only a bare, non-`button` HTML tag needs the `.disabled` class applied by hand — a real
  // `<button>` gets native `:disabled` styling for free (chassis-css matches both selectors,
  // `&:disabled, &.disabled`), and a component reference isn't styled by CloseButton at all
  // (see `isComponentReference` above).
  const _className = isComponentReference
    ? className
    : classNames(
        'close-button',
        { context: color || variant, disabled: kind !== 'button' && disabled },
        color,
        variant,
        size,
        className
      )

  // The default icon-only close button has no visible text, so it needs the 'Close' fallback
  // as its accessible name. Once `children` renders visible content (e.g. custom text passed
  // through `component`), let that content be the accessible name instead — forcing the
  // fallback label here would silently override it (a Label-in-Name accessibility failure).
  // An explicit `label` always wins either way, same as an explicit `aria-label` always did.
  const _label = label ?? (children == null ? 'Close' : undefined)

  // `<a>` has no real `disabled` attribute, so a disabled link close-button still fires
  // click (and still navigates) unless it's blocked here, same guard `Button` applies.
  const handleClick = useDisabledAnchorGuard<HTMLButtonElement | HTMLAnchorElement>(
    kind === 'anchor',
    disabled,
    onClick
  )

  const { buttonProps, forkedRef } = useButtonSemantics<HTMLButtonElement | HTMLAnchorElement>(
    ref as Ref<HTMLButtonElement | HTMLAnchorElement>,
    { disabled, onClick }
  )

  // Rendered as explicit branches, same as `Button`, rather than one `<Component>` tag
  // driven by a `'button' | 'a' | ElementType`-typed variable — a union-typed tag would
  // make JSX intersect all of `button`/`a`/custom prop types at once. Each branch renders
  // `component_` typed as its tag: the tag itself, or the `Slot` holding an element of that kind.
  // `aria-label={_label}` comes before `...rest` in every branch below so that an explicit
  // `aria-label` (not destructured above, so it lands in `rest`) overrides the computed
  // fallback via JSX's last-attribute-wins rule, rather than the other way around.
  if (kind === 'button') {
    const NativeButton = component_ as 'button'
    return (
      <NativeButton
        className={_className}
        aria-label={_label}
        {...(rest as Record<string, unknown>)}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        ref={ref as Ref<HTMLButtonElement>}
      >
        {children}
      </NativeButton>
    )
  }

  if (kind === 'anchor') {
    const Anchor = component_ as 'a'
    return (
      <Anchor
        className={_className}
        aria-label={_label}
        {...(rest as Record<string, unknown>)}
        {...linkProps}
        onClick={handleClick}
        {...(disabled && { 'aria-disabled': true, tabIndex: -1 })}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {children}
      </Anchor>
    )
  }

  const Component = component_ as ElementType

  // Only a bare, non-`button`/`a` HTML tag (e.g. `'span'`) reaches here needing synthesized
  // button semantics — a component reference is trusted to already be interactive, so it
  // skips `buttonProps` (double keyboard activation) and instead gets `color`/`size`/`variant`
  // passed through untouched, per the comment on `isComponentReference` above.
  return (
    <Component
      className={_className}
      aria-label={_label}
      {...(isComponentReference
        ? ({ color, size, variant, disabled, onClick, ...rest } as Record<string, unknown>)
        : (mergeProps(rest, buttonProps) as Record<string, unknown>))}
      {...linkProps}
      ref={isComponentReference ? ref : forkedRef}
    >
      {children}
    </Component>
  )
}

export const CloseButton = createPolymorphicComponent<CloseButtonComponent>(
  CloseButtonRender as ForwardRefRenderFunction<Element, CloseButtonProps<ElementType>>,
  'CloseButton'
)
