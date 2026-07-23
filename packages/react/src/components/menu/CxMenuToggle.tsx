import React, { FC, useContext } from 'react'
import classNames from 'classnames'

import { CxButton, CButtonProps } from '../button/CxButton'
import { CMenuContext } from './CxMenu'
import { focusMenuItem, getMenuItems } from './menuNavigation'

export type CMenuToggleProps = Omit<CButtonProps, 'type'>

export const CxMenuToggle: FC<CMenuToggleProps> = ({
  children,
  className,
  onClick,
  onKeyDown,
  ...rest
}) => {
  const { refs, reference, toggle, show, toggleNodeRef, visible } = useContext(CMenuContext)

  const setRefs = (node: HTMLElement | null) => {
    toggleNodeRef.current = node
    if (reference !== 'parent') {
      refs.setReference(node)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    toggle()
    onClick?.(event as React.MouseEvent<HTMLButtonElement>)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()
      const wasVisible = visible
      show()
      requestAnimationFrame(() => {
        const items = getMenuItems(refs.floating.current)
        focusMenuItem(items, event.key === 'ArrowDown' ? 'first' : 'last')
      })
      if (!wasVisible) {
        onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>)
        return
      }
    }

    onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>)
  }

  return (
    <CxButton
      type="button"
      // The `.caret` utility (rather than styling off `[data-cx-toggle="menu"]`, as the vanilla
      // CSS docs show) keeps this element from also matching Chassis CSS's own vanilla menu.js
      // selectors on a page that happens to load both — this component reimplements all of that
      // behavior itself, so there's nothing for the vanilla plugin to usefully do with it anyway.
      className={classNames('caret', className)}
      aria-expanded={visible}
      {...rest}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={setRefs}
    >
      {children}
    </CxButton>
  )
}

CxMenuToggle.displayName = 'CxMenuToggle'
