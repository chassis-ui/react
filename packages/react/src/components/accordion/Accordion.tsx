import React, { forwardRef, HTMLAttributes, ReactNode, useId, useRef, useState } from 'react'
import classNames from 'classnames'

import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'
import { AccordionItem } from './AccordionItem'
import { AccordionContext } from './context'

export interface AccordionItemDef {
  /**
   * Let this item stay open when another item opens, overriding the accordion's `alwaysOpen` setting.
   */
  alwaysOpen?: boolean
  /**
   * Body content, rendered inside a `AccordionBody`.
   */
  body: ReactNode
  /**
   * A string of all className you want applied to this item.
   */
  className?: string
  /**
   * Header content, rendered inside a `AccordionHeader`.
   */
  header: ReactNode
  /**
   * React key for this item. Falls back to its index when omitted.
   */
  id?: number | string
  /**
   * The group this item shares with other items so only one can be open at a time, overriding the
   * accordion's shared `name`.
   */
  name?: string
  /**
   * Callback fired when this item's open state changes. Chained after `Accordion`'s own handling
   * of `expandedKeys`/`onExpandedChange`, so it fires regardless of whether those are used.
   */
  onToggle?: (event: React.SyntheticEvent<HTMLDetailsElement>) => void
  /**
   * Start the item in the open state (uncontrolled). Ignored for items whose key is included in
   * `expandedKeys`/`defaultExpandedKeys` on the parent `Accordion`.
   */
  open?: boolean
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Make accordion items stay open when another item is opened.
   */
  alwaysOpen?: boolean
  /**
   * Move the caret icon to the end of the header.
   */
  caretEnd?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The keys of the initially expanded items (uncontrolled). Only applies to items rendered via
   * the `items` prop — a composed `AccordionItem` already supports native controlled `open`/
   * `onToggle` directly.
   */
  defaultExpandedKeys?: Array<number | string>
  /**
   * The keys of the currently expanded items (controlled). Only applies to items rendered via the
   * `items` prop — a composed `AccordionItem` already supports native controlled `open`/`onToggle`
   * directly.
   */
  expandedKeys?: Array<number | string>
  /**
   * Removes the default background-context, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.
   */
  flush?: boolean
  /**
   * Array of item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: AccordionItemDef[]
  /**
   * The shared group name used by items that don't set their own `name`. Defaults to an auto-generated id.
   */
  name?: string
  /**
   * Callback fired with the updated set of expanded item keys, reflecting the native `<details>`
   * elements' actual open state (including items the browser closed itself via a shared `name`
   * group). Only fires for items rendered via the `items` prop.
   */
  onExpandedChange?: (keys: Array<number | string>) => void
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      children,
      alwaysOpen = false,
      caretEnd,
      className,
      defaultExpandedKeys,
      expandedKeys,
      flush,
      items,
      name,
      onExpandedChange,
      size,
      ...rest
    },
    ref
  ) => {
    const generatedName = useId()
    const groupName = name ?? generatedName
    const _className = classNames('accordion', { flush, 'caret-end': caretEnd }, size, className)

    const isExpandedControlled = expandedKeys !== undefined
    const isTrackingExpanded =
      isExpandedControlled || defaultExpandedKeys !== undefined || onExpandedChange !== undefined

    const [uncontrolledExpandedKeys, setUncontrolledExpandedKeys] = useState<
      Array<number | string>
    >(
      () =>
        defaultExpandedKeys ??
        items?.filter((item) => item.open).map((item, index) => item.id ?? index) ??
        []
    )
    const currentExpandedKeys = isExpandedControlled ? expandedKeys : uncontrolledExpandedKeys

    // Keyed by each item's id (or index) so a toggle handler can read every sibling's *actual*
    // DOM open state — the browser settles a whole shared-`name` group's open attributes
    // synchronously before dispatching any `toggle` events, so this is always the true next set,
    // regardless of which affected item's handler happens to run first.
    const itemRefs = useRef(new Map<number | string, HTMLDetailsElement | null>())

    const handleItemToggle =
      (id: number | string, itemOnToggle?: AccordionItemDef['onToggle']) =>
      (event: React.SyntheticEvent<HTMLDetailsElement>) => {
        itemOnToggle?.(event)
        if (!items) return
        const next = items
          .map((item, index) => item.id ?? index)
          .filter((key) => itemRefs.current.get(key)?.open)
        if (isExpandedControlled) {
          // React doesn't intercept a native <details> click the way it does controlled form
          // inputs, so the DOM has already toggled by the time this fires. Snap this element back
          // to the still-current controlled value — if the consumer's onExpandedChange updates
          // `expandedKeys` in response, the next render sets it back to the new value anyway.
          ;(event.currentTarget as HTMLDetailsElement).open = expandedKeys.includes(id)
        } else {
          setUncontrolledExpandedKeys(next)
        }
        onExpandedChange?.(next)
      }

    const content = items
      ? items.map((item, index) => {
          const id = item.id ?? index
          return (
            <AccordionItem
              key={id}
              className={item.className}
              open={isTrackingExpanded ? currentExpandedKeys.includes(id) : item.open}
              name={item.name}
              alwaysOpen={item.alwaysOpen}
              onToggle={handleItemToggle(id, item.onToggle)}
              ref={(node) => {
                itemRefs.current.set(id, node)
              }}
            >
              <AccordionHeader>{item.header}</AccordionHeader>
              <AccordionBody>{item.body}</AccordionBody>
            </AccordionItem>
          )
        })
      : children

    return (
      <div className={_className} {...rest} ref={ref}>
        <AccordionContext.Provider value={{ alwaysOpen, name: groupName }}>
          {content}
        </AccordionContext.Provider>
      </div>
    )
  }
)

Accordion.displayName = 'Accordion'
