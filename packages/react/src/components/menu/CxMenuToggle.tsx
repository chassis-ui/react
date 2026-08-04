import React, { forwardRef, useContext, useRef } from 'react'
import classNames from 'classnames'
import { mergeProps, useButton } from 'react-aria'

import { Button, ButtonProps } from '../button/Button'
import { CxMenuContext } from './CxMenu'
import { useForkedRef } from '../../hooks'

export type CxMenuToggleProps = Omit<ButtonProps, 'type'>

export const CxMenuToggle = forwardRef<HTMLButtonElement | HTMLAnchorElement, CxMenuToggleProps>(
  ({ children, className, onClick, onKeyDown, ...rest }, ref) => {
    const { hide, menuTriggerProps, reference, targetRef, toggleNodeRef, visible } =
      useContext(CxMenuContext)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const { buttonProps } = useButton(menuTriggerProps, buttonRef)
    const wasOpenRef = useRef(false)

    const setRefs = (node: HTMLButtonElement | null) => {
      buttonRef.current = node
      toggleNodeRef.current = node
      if (reference !== 'parent') {
        targetRef.current = node
      }
    }

    const forkedRef = useForkedRef(ref, setRefs)

    // react-aria's `useMenuTrigger` opens (rather than toggles) on mouse/pen press start, so
    // re-clicking an already-open trigger would otherwise re-open it right back instead of
    // closing it. Capture whether it was open before that happens — ours has to run ahead of
    // `buttonProps`' own `onPointerDown` in the `mergeProps` chain below — then close it back
    // down on click. Touch is exempt: react-aria's `onPress` already toggles it correctly there.
    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      wasOpenRef.current = event.pointerType !== 'touch' && visible
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (wasOpenRef.current) {
        wasOpenRef.current = false
        hide()
      }
      onClick?.(event)
    }

    return (
      <Button
        type="button"
        // The `.caret` utility (rather than styling off `[data-cx-toggle="menu"]`, as the vanilla
        // CSS docs show) keeps this element from also matching Chassis CSS's own vanilla menu.js
        // selectors on a page that happens to load both — this component reimplements all of that
        // behavior itself, so there's nothing for the vanilla plugin to usefully do with it anyway.
        className={classNames('caret', className)}
        {...mergeProps({ onPointerDown: handlePointerDown }, rest, buttonProps, {
          onClick: handleClick,
          onKeyDown
        })}
        ref={forkedRef}
      >
        {children}
      </Button>
    )
  }
)

CxMenuToggle.displayName = 'CxMenuToggle'
