import React, { forwardRef, useContext, useRef } from 'react'
import classNames from 'classnames'
import { mergeProps, useButton } from 'react-aria'

import { CxButton, CxButtonProps } from '../button/CxButton'
import { CxMenuContext } from './CxMenu'
import { useForkedRef } from '../../hooks'

export type CxMenuToggleProps = Omit<CxButtonProps, 'type'>

export const CxMenuToggle = forwardRef<HTMLButtonElement | HTMLAnchorElement, CxMenuToggleProps>(
  ({ children, className, onClick, onKeyDown, ...rest }, ref) => {
    const { menuTriggerProps, reference, targetRef, toggleNodeRef } = useContext(CxMenuContext)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const { buttonProps } = useButton(menuTriggerProps, buttonRef)

    const setRefs = (node: HTMLButtonElement | null) => {
      buttonRef.current = node
      toggleNodeRef.current = node
      if (reference !== 'parent') {
        targetRef.current = node
      }
    }

    const forkedRef = useForkedRef(ref, setRefs)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      onClick?.(event)
    }

    return (
      <CxButton
        type="button"
        // The `.caret` utility (rather than styling off `[data-cx-toggle="menu"]`, as the vanilla
        // CSS docs show) keeps this element from also matching Chassis CSS's own vanilla menu.js
        // selectors on a page that happens to load both — this component reimplements all of that
        // behavior itself, so there's nothing for the vanilla plugin to usefully do with it anyway.
        className={classNames('caret', className)}
        {...mergeProps(rest, buttonProps, { onClick: handleClick, onKeyDown })}
        ref={forkedRef}
      >
        {children}
      </CxButton>
    )
  }
)

CxMenuToggle.displayName = 'CxMenuToggle'
