<!--
This file is a checked-in snapshot of @chassis-ui/react's public type surface — the exact,
bundled `.d.ts` a consumer's editor sees, generated from `dist/index.d.ts` (built directly by
tsdown, see tsdown.config.ts). It exists to make an accidental breaking change to props/types
show up as an ordinary, reviewable diff on this file, instead of only being discovered by a
consumer after publish.

Regenerate with `pnpm react:check:api:update` after any *intentional* public API change (new prop,
renamed export, ...) and review the diff like any other code change. `pnpm react:check:api` (no
`:update`) is the check that fails CI/local runs when this file and the real build have drifted.
-->

```ts
import React, { AriaAttributes, ButtonHTMLAttributes, ChangeEventHandler, ComponentPropsWithRef, ComponentPropsWithoutRef, DetailsHTMLAttributes, DialogHTMLAttributes, ElementType, FC, FormHTMLAttributes, Fragment, HTMLAttributes, ImgHTMLAttributes, InputHTMLAttributes, Key, LabelHTMLAttributes, MouseEvent, MouseEventHandler, ReactElement, ReactNode, Ref, RefObject, SVGAttributes, TextareaHTMLAttributes, useEffect } from "react";
import { DateValue, I18nProvider, Key as Key$1, RangeValue } from "react-aria";
import { DateValue as DateValue$1, Key as Key$2, Selection, SortDescriptor, TableBodyProps, TableHeaderProps, ToastQueue } from "react-stately";
//#region src/components/accordion/Accordion.d.ts
interface AccordionItemDef {
  /**
   * Let this item stay open when another item opens, overriding the accordion's `alwaysOpen` setting.
   */
  alwaysOpen?: boolean;
  /**
   * Body content, rendered inside a `AccordionBody`.
   */
  body: ReactNode;
  /**
   * A string of all className you want applied to this item.
   */
  className?: string;
  /**
   * Header content, rendered inside a `AccordionHeader`.
   */
  header: ReactNode;
  /**
   * React key for this item. Falls back to its index when omitted.
   */
  id?: number | string;
  /**
   * The group this item shares with other items so only one can be open at a time, overriding the
   * accordion's shared `name`.
   */
  name?: string;
  /**
   * Callback fired when this item's open state changes. Chained after `Accordion`'s own handling
   * of `expandedKeys`/`onExpandedChange`, so it fires regardless of whether those are used.
   */
  onToggle?: (event: React.SyntheticEvent<HTMLDetailsElement>) => void;
  /**
   * Start the item in the open state (uncontrolled). Ignored for items whose key is included in
   * `expandedKeys`/`defaultExpandedKeys` on the parent `Accordion`.
   */
  open?: boolean;
}
interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Make accordion items stay open when another item is opened.
   */
  alwaysOpen?: boolean;
  /**
   * Move the caret icon to the end of the header.
   */
  caretEnd?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The keys of the initially expanded items (uncontrolled). Only applies to items rendered via
   * the `items` prop — a composed `AccordionItem` already supports native controlled `open`/
   * `onToggle` directly.
   */
  defaultExpandedKeys?: Array<number | string>;
  /**
   * The keys of the currently expanded items (controlled). Only applies to items rendered via the
   * `items` prop — a composed `AccordionItem` already supports native controlled `open`/`onToggle`
   * directly.
   */
  expandedKeys?: Array<number | string>;
  /**
   * Removes the default background-context, some borders, and some rounded corners to render accordions edge-to-edge with their parent container.
   */
  flush?: boolean;
  /**
   * Array of item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: AccordionItemDef[];
  /**
   * The shared group name used by items that don't set their own `name`. Defaults to an auto-generated id.
   */
  name?: string;
  /**
   * Callback fired with the updated set of expanded item keys, reflecting the native `<details>`
   * elements' actual open state (including items the browser closed itself via a shared `name`
   * group). Only fires for items rendered via the `items` prop.
   */
  onExpandedChange?: (keys: Array<number | string>) => void;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
}
declare const Accordion: React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/utils/polymorphic.d.ts
type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref'];
/**
 * Props for a polymorphic component: `OwnProps` (which must declare `component?: C`) plus
 * whatever props `C` itself accepts, minus any name already claimed by `OwnProps` so the two
 * don't conflict. Lets consumers swap `component` for e.g. a framework's `Image` and get full
 * type-checking/autocomplete for that component's own props at the call site.
 */
type PolymorphicComponentProps<C extends ElementType, OwnProps extends object> = OwnProps & Omit<ComponentPropsWithoutRef<C>, keyof OwnProps>;
//#endregion
//#region src/components/accordion/AccordionBody.d.ts
type AccordionBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type AccordionBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, AccordionBodyOwnProps<C>>;
type AccordionBodyComponent = (<C extends ElementType = 'div'>(props: AccordionBodyProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const AccordionBody: AccordionBodyComponent;
//#endregion
//#region src/components/accordion/AccordionHeader.d.ts
interface AccordionHeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
}
declare const AccordionHeader: React.ForwardRefExoticComponent<AccordionHeaderProps & React.RefAttributes<HTMLElement>>;
//#endregion
//#region src/components/accordion/AccordionItem.d.ts
interface AccordionItemProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  /**
   * Let this item stay open when another item opens, overriding the accordion's `alwaysOpen` setting.
   */
  alwaysOpen?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The group this item shares with other items so only one can be open at a time, overriding the
   * accordion's shared `name`.
   */
  name?: string;
  /**
   * Start the item in the open state.
   */
  open?: boolean;
  /**
   * @deprecated No longer used. The native details element manages its own state.
   */
  itemKey?: number | string;
}
declare const AccordionItem: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<HTMLDetailsElement>>;
//#endregion
//#region src/components/menu/MenuItemDef.d.ts
interface MenuItemDef {
  /**
   * Discriminates this entry from `MenuHeaderDef`/`MenuDividerDef` in a `MenuItemsDef`
   * array. Omit for a normal item — it's the default.
   */
  type?: 'item';
  /**
   * React key for this item.
   */
  id: Key$2;
  /**
   * Label content for the item.
   */
  label: ReactNode;
  /**
   * Text used for filtering/typeahead. Required when `label` isn't a plain string — components
   * that filter (e.g. `Combobox`, `Autocomplete`) can't derive it from rich content.
   */
  textValue?: string;
  /**
   * URL for the item, when it acts as a link.
   */
  href?: string;
  /**
   * Callback fired when the item is activated.
   */
  onClick?: () => void;
  /**
   * Marks the item as disabled — it can't be clicked or reached via the keyboard.
   */
  disabled?: boolean;
  /**
   * Marks the item as the current selection in a choice list.
   */
  selected?: boolean;
  /**
   * Icon rendered at the item's leading edge (`.menu-item-icon`).
   */
  icon?: ReactNode;
  /**
   * Secondary line of text rendered below the label (`.menu-item-description`).
   */
  description?: ReactNode;
}
interface MenuHeaderDef {
  /**
   * Discriminates this entry as a non-interactive group header.
   */
  type: 'header';
  /**
   * React key for this entry.
   */
  id: Key$2;
  /**
   * Header content.
   */
  label: ReactNode;
}
interface MenuDividerDef {
  /**
   * Discriminates this entry as a divider.
   */
  type: 'divider';
  /**
   * React key for this entry.
   */
  id: Key$2;
}
/**
 * A flat array of item/header/divider definitions for data-driven rendering — headers and
 * dividers are interleaved with items in authoring order, matching how chassis-css itself
 * renders grouped items (flat DOM siblings under `.menu`, no wrapping element per group).
 *
 * Covers flat items, headers, and dividers only — nested/recursive submenus aren't
 * representable here. Compose with `children`/`MenuSubmenu` directly for those.
 */
type MenuItemsDef = (MenuDividerDef | MenuHeaderDef | MenuItemDef)[];
//#endregion
//#region src/components/autocomplete/Autocomplete.d.ts
interface AutocompleteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * An accessible label for the autocomplete, used when there's no visible `<label>`.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible `<label>` element for the autocomplete.
   */
  'aria-labelledby'?: string;
  /**
   * `AutocompleteItem` elements, optionally wrapped in `AutocompleteGroup` — read as data by
   * `Autocomplete` to build the option list. Not rendered directly. Ignored when `items` is set.
   */
  children?: ReactNode;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The initial selected option's id(s) (uncontrolled). An array when `multiple` is set.
   */
  defaultValue?: Key$2 | Key$2[] | null;
  /**
   * Prevents the autocomplete from being focused or interacted with.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the autocomplete.
   */
  help?: ReactNode;
  /**
   * `id` forwarded to the search input inside the popover. The toggle — the field's real,
   * always-focusable surface — has no single labelable element `<label for>` can target (it's a
   * `role="button"` `<div>`, and the search input itself is hidden until open), so `label` is
   * associated via `aria-labelledby` on the toggle instead. See FORMS.md's "role=group" pattern.
   */
  id?: string;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the autocomplete when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. A `'header'` entry starts a group that all following items join until the next
   * header or the end of the array. `'divider'` entries are a no-op here — use
   * `AutocompleteGroup` composition instead if you need finer control over grouping. An entry's
   * `href`/`onClick` are `Menu`-only and are not read here — use `onChange` to react to the
   * selection instead.
   */
  items?: MenuItemsDef;
  /**
   * The field's caption, rendered as a `FormLabel` associated with the toggle.
   */
  label?: ReactNode;
  /**
   * Allows more than one option to be selected. The toggle shows the single selection's label,
   * or an "N selected" count once more than one is picked. The menu stays open after each
   * selection, and `Backspace` in the empty search field removes the last selected option.
   */
  multiple?: boolean;
  /**
   * `name` of auto-created hidden input(s), kept in sync with the selection, for native form
   * submission. Single-select renders one; `multiple` renders one per selected key. Omit to skip
   * hidden-input creation.
   */
  name?: string;
  /**
   * Text shown in the listbox when no options match the current query.
   */
  noResultsText?: ReactNode;
  /**
   * Callback fired when the selection changes. Receives an array of keys when `multiple` is set.
   */
  onChange?: (value: Key$2 | Key$2[] | null) => void;
  /**
   * Text shown on the toggle when nothing is selected.
   */
  placeholder?: string;
  /**
   * Placeholder for the search field inside the dropdown.
   */
  searchPlaceholder?: string;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the autocomplete when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The selected option's id(s) (controlled). An array when `multiple` is set.
   */
  value?: Key$2 | Key$2[] | null;
}
declare const Autocomplete: {
  ({ children, className, defaultValue, disabled, help, id, invalid, invalidFeedback, items, label, multiple, name, noResultsText, onChange, placeholder, searchPlaceholder, size, valid, validFeedback, value, ...rest }: AutocompleteProps): ReactNode;
  displayName: string;
};
//#endregion
//#region src/components/combobox/ComboboxGroup.d.ts
interface ComboboxGroupProps {
  /**
   * Items belonging to this group.
   */
  children: ReactNode;
  /**
   * Header content for the group (`.menu-header`).
   */
  label: ReactNode;
}
declare const ComboboxGroup: {
  (_props: ComboboxGroupProps): null;
  displayName: string;
};
//#endregion
//#region src/components/autocomplete/AutocompleteGroup.d.ts
type AutocompleteGroupProps = ComboboxGroupProps;
declare const AutocompleteGroup: {
  (_props: AutocompleteGroupProps): null;
  displayName: string;
};
//#endregion
//#region src/components/combobox/ComboboxItem.d.ts
interface ComboboxItemProps {
  /**
   * Content of the option. Used as the filter/typeahead text when `textValue` isn't set — pass
   * `textValue` explicitly whenever `children` isn't a plain string (e.g. it wraps an icon or
   * other rich markup), since it can't otherwise be derived from rich content.
   */
  children: ReactNode;
  /**
   * Secondary line of text rendered below `children` (`.menu-item-description`).
   */
  description?: ReactNode;
  /**
   * Prevents the option from being selected, focused, or otherwise interacted with.
   */
  disabled?: boolean;
  /**
   * Icon rendered at the option's leading edge (`.menu-item-icon`).
   */
  icon?: ReactNode;
  /**
   * Identifies this option. Submitted as the value when this option is selected.
   */
  id: Key$2;
  /**
   * Text used for filtering and typeahead. Required when `children` isn't a plain string —
   * falls back to `children` itself when omitted and `children` is a string.
   */
  textValue?: string;
}
declare const ComboboxItem: {
  (_props: ComboboxItemProps): null;
  displayName: string;
};
//#endregion
//#region src/components/autocomplete/AutocompleteItem.d.ts
type AutocompleteItemProps = ComboboxItemProps;
declare const AutocompleteItem: {
  (_props: AutocompleteItemProps): null;
  displayName: string;
};
//#endregion
//#region src/types.d.ts
/**
 * Breakpoints
 */
type Breakpoint = '2xlarge' | 'large' | 'medium' | 'small' | 'xlarge';
/**
 * Context colors
 */
type ContextColor = 'alternate' | 'black' | 'danger' | 'default' | 'info' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'white';
/**
 * Context styles
 */
type ContextStyle = 'basic' | 'outline' | 'smooth' | 'solid';
/**
 * Component sizes
 */
type Sizing = 'large' | 'medium' | 'small';
/**
 * Extended sizes
 */
type ExtendedSizing = '2xlarge' | '2xsmall' | 'xlarge' | 'xsmall' | Sizing;
/**
 * Spacing values. `SPACING` is the runtime source of truth — `Spacing` is derived from it so the
 * two can't drift apart; anything needing the values at runtime (e.g. validating a string against
 * the scale) should import `SPACING`, not hand-copy the list.
 */
declare const SPACING: readonly ["zero", "4xsmall", "3xsmall", "2xsmall", "xsmall", "small", "medium", "large", "xlarge", "2xlarge", "3xlarge", "4xlarge", "5xlarge", "6xlarge"];
type Spacing = (typeof SPACING)[number];
/**
 * Component shapes
 */
type Shapes = 'rounded' | 'rounded-0' | 'rounded-1' | 'rounded-2' | 'rounded-3' | 'rounded-bottom' | 'rounded-circle' | 'rounded-end' | 'rounded-pill' | 'rounded-start' | 'rounded-top';
//#endregion
//#region src/components/avatar/Avatar.d.ts
type AvatarOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Toggle the disabled state for the component. Only applies when `component` is `a` or `button`.
   */
  disabled?: boolean;
  /**
   * Renders the smooth (tinted background) context variant instead of the solid default.
   */
  smooth?: boolean;
  /**
   * Sets the size of the component to one of Chassis component sizes.
   */
  size?: ExtendedSizing;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `span`, or `a` when `href` is set. Set explicitly to `button` (or another
   * interactive element/component) to make a non-link avatar focusable and clickable.
   */
  component?: C;
  /**
   * Image source. When set, renders an `AvatarImage` in place of `children`.
   */
  src?: string;
  /**
   * Alt text for the image rendered when `src` is set.
   */
  alt?: string;
  /**
   * Renders the avatar as a link to this URL. Defaults `component` to `a`. Passed through to a
   * custom `component` too, regardless of whether it resolves to a native `a`/`button`.
   */
  href?: string;
  /**
   * Renders a status badge in the bottom-end corner, in one of the Chassis themed colors.
   */
  status?: ContextColor;
  /**
   * Accessible label for the status badge, exposed to assistive tech as visually hidden text.
   * Falls back to the `status` value itself.
   */
  statusLabel?: string;
};
type AvatarProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, AvatarOwnProps<C>>;
type AvatarComponent = (<C extends ElementType = 'span'>(props: AvatarProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Avatar: AvatarComponent;
//#endregion
//#region src/components/avatar/AvatarImage.d.ts
interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
}
declare const AvatarImage: React.ForwardRefExoticComponent<AvatarImageProps & React.RefAttributes<HTMLImageElement>>;
//#endregion
//#region src/components/avatar/AvatarStack.d.ts
interface AvatarStackItemDef {
  /**
   * React key for the rendered `Avatar`. Falls back to the item's index in `data`.
   */
  key?: number | string;
  /**
   * Image source, rendered via `AvatarImage`.
   */
  src?: string;
  /**
   * Alt text for the image rendered when `src` is set.
   */
  alt?: string;
  /**
   * Renders the avatar as a link to this URL.
   */
  href?: string;
  /**
   * Renders a status badge in one of the Chassis themed colors.
   */
  status?: ContextColor;
  /**
   * Accessible label for the status badge.
   */
  statusLabel?: string;
  /**
   * Content to render when `src` isn't set, e.g. initials or a "+5" overflow count.
   */
  content?: ReactNode;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: ElementType;
}
type AvatarStackOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Sets the size of every `Avatar` in the stack to one of Chassis component sizes.
   */
  size?: ExtendedSizing;
  /**
   * Renders a `Avatar` for each item, ahead of any JSX `children` (handy for a trailing "+N"
   * overflow avatar).
   */
  items?: AvatarStackItemDef[];
};
type AvatarStackProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, AvatarStackOwnProps<C>>;
type AvatarStackComponent = (<C extends ElementType = 'div'>(props: AvatarStackProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const AvatarStack: AvatarStackComponent;
//#endregion
//#region src/components/notification/Notification.d.ts
interface NotificationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Optional trailing content — e.g. a row of `Button`s — rendered after `text`/`children`.
   */
  actions?: ReactNode;
  /**
   * Automatically dismiss the notification after `delay`. The timer pauses while the pointer
   * or focus is on the notification, and only starts once the notification is visible.
   * Defaults to `false` — unlike `Toast`, notifications are persistent banners by default.
   */
  autohide?: boolean;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Overrides the dismiss button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Delay in ms before an `autohide` notification dismisses itself.
   */
  delay?: number;
  /**
   * Optionally add a close button to the notification and allow it to self dismiss.
   */
  dismissible?: boolean;
  /**
   * Leading icon. A string is rendered as `<NotificationIcon name={icon} />`; pass any other
   * node for a fully custom icon. Automatically top-aligns with `title` when both are set —
   * a custom icon node is responsible for its own alignment.
   */
  icon?: ReactNode | string;
  /**
   * Applies the solid context style to the notification.
   */
  solid?: boolean;
  /**
   * Message body, rendered via a single `<NotificationText>`. For multi-block content, compose
   * `children` manually instead — `text` wraps everything in one element.
   */
  text?: ReactNode;
  /**
   * Heading, rendered via `<NotificationTitle>`.
   */
  title?: ReactNode;
  /**
   * Element or component used for the `title` heading. Passed through to `NotificationTitle`'s
   * own `component` prop. Defaults to `'h4'`.
   */
  titleComponent?: ElementType;
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: () => void;
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void;
  /**
   * ARIA live-region role. Use `status` (the default) for confirmation, progress, and
   * informational messages, which announce politely. Use `alert` for messages that need
   * immediate attention — validation errors, failed operations — which interrupt speech.
   */
  role?: 'alert' | 'status';
  /**
   * Toggle the visibility of component.
   */
  visible?: boolean;
}
declare const Notification: React.ForwardRefExoticComponent<NotificationProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/notification/NotificationTitle.d.ts
type NotificationTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type NotificationTitleProps<C extends ElementType = 'h4'> = PolymorphicComponentProps<C, NotificationTitleOwnProps<C>>;
type NotificationTitleComponent = (<C extends ElementType = 'h4'>(props: NotificationTitleProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const NotificationTitle: NotificationTitleComponent;
//#endregion
//#region src/components/icon/Icon.d.ts
interface IconOwnProps {
  /**
   * Icon name, e.g. `folder-tree`. Matches a `cx-{name}` font glyph class or an id in the SVG sprite.
   */
  name: string;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Width/height (in px) applied to the SVG. Ignored in `font` mode.
   */
  size?: number;
  /**
   * Accessible name. When set, the icon is exposed to assistive tech instead of hidden.
   */
  title?: string;
  /**
   * Path to the SVG sprite file. Ignored in `font` mode.
   */
  sprite?: string;
}
type IconProps = (IconOwnProps & {
  font: true;
} & Omit<HTMLAttributes<HTMLSpanElement>, keyof IconOwnProps>) | (IconOwnProps & {
  font?: false;
} & Omit<SVGAttributes<SVGSVGElement>, keyof IconOwnProps>);
declare const Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<HTMLSpanElement | SVGSVGElement>>;
//#endregion
//#region src/components/notification/NotificationIcon.d.ts
type NotificationIconProps = IconProps & {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
};
declare const NotificationIcon: React.ForwardRefExoticComponent<NotificationIconProps & React.RefAttributes<HTMLSpanElement | SVGSVGElement>>;
//#endregion
//#region src/components/notification/NotificationText.d.ts
type NotificationTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type NotificationTextProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, NotificationTextOwnProps<C>>;
type NotificationTextComponent = (<C extends ElementType = 'div'>(props: NotificationTextProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const NotificationText: NotificationTextComponent;
//#endregion
//#region src/components/notification/NotificationStack.d.ts
interface NotificationStackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Queued notifications show newest-first by default — the typical toast pattern. Set
   * `reverse` for a chronological transcript instead, oldest-first.
   */
  reverse?: boolean;
}
declare const NotificationStack: React.ForwardRefExoticComponent<NotificationStackProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/notification/notificationQueue.d.ts
interface NotificationContent extends Pick<NotificationProps, 'actions' | 'autohide' | 'closeLabel' | 'color' | 'delay' | 'dismissible' | 'icon' | 'role' | 'solid' | 'text' | 'title' | 'titleComponent'> {
  /**
   * Content of the notification. Compose manually (typically a `NotificationIcon`/
   * `NotificationTitle`/`NotificationText`), or leave empty and use the `icon`/`title`/`text`
   * shorthand options instead.
   */
  children?: ReactNode;
}
declare const notificationQueue: ToastQueue<NotificationContent>;
declare function addNotification(children?: ReactNode, options?: Omit<NotificationContent, 'children'>): string;
declare function closeNotification(key: string): void;
//#endregion
//#region src/components/badge/Badge.d.ts
type BadgeOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Sets the context style of the component. `solid`/`basic` render the default look with no extra class.
   */
  variant?: ContextStyle;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Position badge in one of the corners of a link or button.
   */
  position?: 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';
  /**
   * Select the shape of the component.
   */
  circle?: boolean;
  /**
   * Sets the size of the component to one of Chassis component sizes.
   */
  size?: Sizing;
};
type BadgeProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, BadgeOwnProps<C>>;
type BadgeComponent = (<C extends ElementType = 'span'>(props: BadgeProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Badge: BadgeComponent;
//#endregion
//#region src/components/breadcrumb/Breadcrumb.d.ts
interface BreadcrumbItemDef {
  /**
   * Label for the breadcrumb item.
   */
  label: React.ReactNode;
  /**
   * URL for the breadcrumb link. The last item in the array is always rendered as active (no link needed).
   */
  href?: string;
}
interface BreadcrumbProps extends HTMLAttributes<HTMLOListElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Array of breadcrumb items for data-driven rendering. The last item is automatically marked active.
   * When provided, children are ignored.
   */
  items?: BreadcrumbItemDef[];
}
declare const Breadcrumb: React.ForwardRefExoticComponent<BreadcrumbProps & React.RefAttributes<HTMLOListElement>>;
//#endregion
//#region src/components/breadcrumb/BreadcrumbItem.d.ts
interface BreadcrumbItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The `href` attribute for the inner `<Link>` component.
   */
  href?: string;
}
declare const BreadcrumbItem: React.ForwardRefExoticComponent<BreadcrumbItemProps & React.RefAttributes<HTMLLIElement>>;
//#endregion
//#region src/components/button/Button.d.ts
type ButtonOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * The href attribute specifies the URL of the page the link goes to.
   */
  href?: string;
  /**
   * Fires on click. Typed for every element `component` can actually render (`button`, `a`,
   * `input`, or a custom component), rather than narrowed to `HTMLButtonElement` alone.
   */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement | HTMLInputElement>;
  /**
   * Marks the button as pressed for toggle-style usage (e.g. a formatting toolbar button).
   * Applies the `.active` class and sets `aria-pressed` so assistive technology announces
   * "button, pressed" rather than treating the button as a navigation link.
   */
  pressed?: boolean;
  /**
   * Select the shape of the component.
   */
  shape?: Shapes;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Specifies the type of button. Always specify the type attribute for the `<button>` element.
   * Different browsers may use different default types for the `<button>` element.
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * Set the button style variant. Same as `ContextStyle`, but `solid` (the unmodified default
   * look) doesn't apply as a class, and `link` — button-specific, not a context color — makes
   * the button look and behave like a hyperlink while keeping its `color`.
   */
  variant?: 'link' | Exclude<ContextStyle, 'solid'>;
};
type ButtonProps<C extends ElementType = 'button'> = PolymorphicComponentProps<C, ButtonOwnProps<C>>;
type ButtonComponent = (<C extends ElementType = 'button'>(props: ButtonProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Button: ButtonComponent;
//#endregion
//#region src/components/button-group/ButtonGroup.d.ts
type ButtonGroupOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Create a set of buttons that appear vertically stacked rather than horizontally. Split button dropdowns are not supported here.
   */
  vertical?: boolean;
};
type ButtonGroupProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ButtonGroupOwnProps<C>>;
type ButtonGroupComponent = (<C extends ElementType = 'div'>(props: ButtonGroupProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ButtonGroup: ButtonGroupComponent;
//#endregion
//#region src/components/button-group/ButtonToolbar.d.ts
type ButtonToolbarOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type ButtonToolbarProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ButtonToolbarOwnProps<C>>;
type ButtonToolbarComponent = (<C extends ElementType = 'div'>(props: ButtonToolbarProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ButtonToolbar: ButtonToolbarComponent;
//#endregion
//#region src/components/calendar/Calendar.d.ts
interface CalendarBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * An accessible label for the calendar, used when there's no visible label. Required for
   * standalone use — a calendar grid has no other accessible name of its own.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible label element for the calendar.
   */
  'aria-labelledby'?: string;
  /**
   * Whether to automatically focus the calendar when it mounts.
   */
  autoFocus?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Prevents the calendar from being focused or interacted with.
   */
  disabled?: boolean;
  /**
   * The day that starts the week, overriding the default set by the active locale.
   *
   * @default 'mon'
   */
  firstDayOfWeek?: 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue$1) => boolean;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue$1 | null;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue$1 | null;
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   */
  unavailableDates?: string[];
  /**
   * Number of months to display side by side, sharing one selection. Wraps to multiple rows in
   * a narrow container (e.g. a popover on a small screen) rather than overflowing — the wrap is
   * driven by the calendar's own width, not the viewport, so it adapts correctly regardless of
   * where the calendar is embedded.
   *
   * @default 1
   */
  visibleMonths?: number;
}
interface CalendarSingleProps extends CalendarBaseProps {
  /**
   * The initial selected date (uncontrolled).
   */
  defaultValue?: DateValue$1 | null;
  /**
   * Callback fired when the selected date changes. Unlike `DatePicker`'s `onChange` (whose
   * segmented field can be cleared to `null`), a calendar selection is always a concrete date.
   */
  onChange?: (value: DateValue$1) => void;
  /**
   * Whether a single date or multiple, independently toggled dates can be selected.
   *
   * @default 'single'
   */
  selectionMode?: 'single';
  /**
   * The selected date (controlled).
   */
  value?: DateValue$1 | null;
}
interface CalendarMultipleProps extends CalendarBaseProps {
  /**
   * The initial selected dates (uncontrolled).
   */
  defaultValue?: DateValue$1[] | null;
  /**
   * Callback fired when the set of selected dates changes.
   */
  onChange?: (value: DateValue$1[]) => void;
  /**
   * Whether a single date or multiple, independently toggled dates can be selected.
   *
   * @default 'single'
   */
  selectionMode: 'multiple';
  /**
   * The selected dates (controlled).
   */
  value?: DateValue$1[] | null;
}
type CalendarProps = CalendarMultipleProps | CalendarSingleProps;
declare const Calendar: React.ForwardRefExoticComponent<CalendarProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/utils/dateRangePresets.d.ts
interface DateRangePreset {
  label: string;
  range: RangeValue<DateValue>;
}
//#endregion
//#region src/components/calendar/RangeCalendar.d.ts
interface RangeCalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * An accessible label for the calendar, used when there's no visible label. Required for
   * standalone use — a calendar grid has no other accessible name of its own.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible label element for the calendar.
   */
  'aria-labelledby'?: string;
  /**
   * Whether to automatically focus the calendar when it mounts.
   */
  autoFocus?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue$1> | null;
  /**
   * Prevents the calendar from being focused or interacted with.
   */
  disabled?: boolean;
  /**
   * The day that starts the week, overriding the default set by the active locale.
   *
   * @default 'mon'
   */
  firstDayOfWeek?: 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue$1) => boolean;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue$1 | null;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue$1 | null;
  /**
   * Callback fired when a complete range is selected (both a start and end date).
   */
  onChange?: (value: RangeValue<DateValue$1>) => void;
  /**
   * A list of quick-select range presets shown beside the calendar. Selecting a preset commits
   * its range immediately, the same as picking a start and end date from the grid. The preset
   * matching the current selection (if any) is marked selected. Omit to not show a preset list.
   */
  presets?: DateRangePreset[];
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   */
  unavailableDates?: string[];
  /**
   * The selected date range (controlled).
   */
  value?: RangeValue<DateValue$1> | null;
  /**
   * Number of months to display side by side, sharing one selection. Wraps to multiple rows in
   * a narrow container (e.g. a popover on a small screen) rather than overflowing — the wrap is
   * driven by the calendar's own width, not the viewport, so it adapts correctly regardless of
   * where the calendar is embedded.
   *
   * @default 1
   */
  visibleMonths?: number;
}
declare const RangeCalendar: React.ForwardRefExoticComponent<RangeCalendarProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/utils/breakpoints.d.ts
type Span = 'auto' | boolean | number | string;
type FlexDirection = 'column' | 'row';
//#endregion
//#region src/components/card/Card.d.ts
type CardOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Switches the card from its default stacked (column) layout to a side-by-side (row) layout.
   * Wrap the image and body in `Col` to control each side's width.
   */
  direction?: FlexDirection;
  /**
   * Shorthand for a `CardFooter`, rendered after the image/title/subtitle/text/`children` block.
   */
  footer?: ReactNode;
  /**
   * Shorthand for a `CardImage` — pass either a `src` URL (combine with `imageAlt`/
   * `imageOrientation`) or a fully-formed element — a `<CardImage>`, `<Skeleton>`,
   * `<Placeholder>`, or anything else — rendered as-is in its place. `imageAlt`/`imageOrientation`
   * only apply to the `src` form; set them directly on your own element otherwise. For a
   * horizontal layout or an overlay, omit this and compose `CardImage` directly as a child
   * instead.
   */
  image?: ReactNode;
  /**
   * Accessible alt text for `image`. Ignored unless `image` is set.
   */
  imageAlt?: string;
  /**
   * Orientates `image` to the top (default) or bottom of the card.
   */
  imageOrientation?: 'bottom' | 'top';
  /**
   * Overrides `direction` at one or more breakpoints — e.g. `{ large: 'row' }` to lay the card
   * out horizontally from `large` up while stacking below it.
   */
  responsive?: Partial<Record<Breakpoint, FlexDirection>>;
  /**
   * Sets the size of the component to one of Chassis component sizes.
   */
  size?: Sizing;
  /**
   * Shorthand for a `CardSubtitle`, rendered directly after `title`.
   */
  subtitle?: ReactNode;
  /**
   * Shorthand for a `CardText`, rendered after `title`/`subtitle`.
   */
  text?: ReactNode;
  /**
   * Shorthand for a `CardTitle`. Set alongside `subtitle`/`text` (or plain `children`, e.g. a
   * `Button`) to build a standard card without composing `CardBody`/`CardTitle` yourself — all
   * render together inside a single `CardBody`, in that order. Only takes effect when at least
   * one of `image`/`title`/`subtitle`/`text`/`footer` is set; otherwise `children` render as-is,
   * so full manual composition (`CardHeader`, lists, overlays, nav headers, …) keeps working
   * unchanged. Mixing shorthand props with a manually-composed `children` tree isn't supported —
   * pick one approach per card.
   */
  title?: ReactNode;
  /**
   * Sets the context style of the component. `basic` (the default) renders with no extra class.
   */
  variant?: ContextStyle;
};
type CardProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardOwnProps<C>>;
type CardComponent = (<C extends ElementType = 'div'>(props: CardProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Card: CardComponent;
//#endregion
//#region src/components/card/CardBody.d.ts
type CardBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Switches the body from its default stacked (column) layout to a side-by-side (row) layout —
   * for placing an image beside text within a single padded region. Wrap the image and text in
   * `Col` to control each side's width, and nest another `CardBody` (with `.p-0`) for the text
   * side so it doesn't receive double padding.
   */
  direction?: FlexDirection;
  /**
   * Spacing between children, mapped to the `gap-*` utility classes. Overrides the card's default
   * gap between body children.
   */
  gap?: 0 | Spacing;
  /**
   * Overrides `direction` at one or more breakpoints.
   */
  responsive?: Partial<Record<Breakpoint, FlexDirection>>;
};
type CardBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardBodyOwnProps<C>>;
type CardBodyComponent = (<C extends ElementType = 'div'>(props: CardBodyProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardBody: CardBodyComponent;
//#endregion
//#region src/components/card/CardFooter.d.ts
type CardFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CardFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardFooterOwnProps<C>>;
type CardFooterComponent = (<C extends ElementType = 'div'>(props: CardFooterProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardFooter: CardFooterComponent;
//#endregion
//#region src/components/card/CardGroup.d.ts
type CardGroupOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CardGroupProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardGroupOwnProps<C>>;
type CardGroupComponent = (<C extends ElementType = 'div'>(props: CardGroupProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardGroup: CardGroupComponent;
//#endregion
//#region src/components/card/CardHeader.d.ts
type CardHeaderOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CardHeaderProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardHeaderOwnProps<C>>;
type CardHeaderComponent = (<C extends ElementType = 'div'>(props: CardHeaderProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardHeader: CardHeaderComponent;
//#endregion
//#region src/components/card/CardImage.d.ts
type CardImageOrientation = 'bottom' | 'end' | 'start' | 'top';
type CardImageOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component —
   * e.g. a framework's own `Image` component. Its own props (`src`, `fill`, `priority`, etc.)
   * are type-checked at the call site once passed here.
   */
  component?: C;
  /**
   * Orientates the image to the top or bottom of the card as an "image cap", or to the start/end
   * for a horizontal layout. Omit to round all four corners for use inside `CardBody`.
   */
  orientation?: CardImageOrientation;
  /**
   * Overrides `orientation` at one or more breakpoints — e.g. `{ large: 'start' }` to switch an
   * image cap from `top` to `start` once the card lays out horizontally.
   */
  responsive?: Partial<Record<Breakpoint, CardImageOrientation>>;
};
type CardImageProps<C extends ElementType = 'img'> = PolymorphicComponentProps<C, CardImageOwnProps<C>>;
type CardImageComponent = (<C extends ElementType = 'img'>(props: CardImageProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardImage: CardImageComponent;
//#endregion
//#region src/components/card/CardImageOverlay.d.ts
type CardImageOverlayOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CardImageOverlayProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CardImageOverlayOwnProps<C>>;
type CardImageOverlayComponent = (<C extends ElementType = 'div'>(props: CardImageOverlayProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardImageOverlay: CardImageOverlayComponent;
//#endregion
//#region src/components/link/Link.d.ts
type LinkOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the link color to one of Chassis context colors, including its interactive
   * (`:hover`/`:focus`/`:active`/`:visited`) states.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * The href attribute specifies the URL of the page the link goes to. Only meaningful when
   * `component` resolves to (or accepts) `'a'`. Declared explicitly here — rather than left to
   * flow through generically from whatever `C` is — so consumers that wrap `Link` (`MenuItem`,
   * `ListItem`, `NavLink`) can read it with a concrete type regardless of `component`.
   */
  href?: string;
  /**
   * Fires on click.
   */
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Aligns a leading or trailing icon with the link text using flexbox, with a gap between
   * them and an offset underline. Icons need to be passed as `children` alongside the text.
   * Named `iconLink` rather than `icon` to avoid colliding with components (e.g. `MenuItem`)
   * that already have their own, differently-typed `icon` prop for the icon content itself.
   */
  iconLink?: boolean;
  /**
   * Removes the foreground color override, so the link inherits its color from the nearest
   * ancestor instead of the default link color.
   */
  reset?: boolean;
  /**
   * Expands the link's click target to fill its positioned ancestor (the nearest ancestor with
   * a `position` other than `static`).
   */
  stretched?: boolean;
  /**
   * Specifies the type of button. Only applies when `component="button"`. Different browsers may
   * use different default types for the `<button>` element, so always specify it explicitly.
   */
  type?: 'button' | 'reset' | 'submit';
};
type LinkProps<C extends ElementType = 'a'> = PolymorphicComponentProps<C, LinkOwnProps<C>>;
type LinkComponent = (<C extends ElementType = 'a'>(props: LinkProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Link: LinkComponent;
//#endregion
//#region src/components/card/CardLink.d.ts
type CardLinkOwnProps = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
};
type CardLinkProps<C extends ElementType = 'a'> = LinkProps<C> & CardLinkOwnProps;
type CardLinkComponent = (<C extends ElementType = 'a'>(props: CardLinkProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardLink: CardLinkComponent;
//#endregion
//#region src/components/card/CardSubtitle.d.ts
type CardSubtitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CardSubtitleProps<C extends ElementType = 'h6'> = PolymorphicComponentProps<C, CardSubtitleOwnProps<C>>;
type CardSubtitleComponent = (<C extends ElementType = 'h6'>(props: CardSubtitleProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardSubtitle: CardSubtitleComponent;
//#endregion
//#region src/components/card/CardText.d.ts
type CardTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CardTextProps<C extends ElementType = 'p'> = PolymorphicComponentProps<C, CardTextOwnProps<C>>;
type CardTextComponent = (<C extends ElementType = 'p'>(props: CardTextProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardText: CardTextComponent;
//#endregion
//#region src/components/card/CardTitle.d.ts
type CardTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CardTitleProps<C extends ElementType = 'h5'> = PolymorphicComponentProps<C, CardTitleOwnProps<C>>;
type CardTitleComponent = (<C extends ElementType = 'h5'>(props: CardTitleProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CardTitle: CardTitleComponent;
//#endregion
//#region src/components/carousel/context.d.ts
type CarouselEnds = 'loop' | 'stop' | 'wrap';
//#endregion
//#region src/components/carousel/Carousel.d.ts
type CarouselTransition = 'fade' | 'scroll';
interface CarouselSlideDetail {
  /**
   * Direction of travel, mirrored in RTL.
   */
  direction: 'left' | 'right';
  /**
   * Index of the outgoing slide.
   */
  from: number;
  /**
   * Index of the incoming slide.
   */
  to: number;
}
interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The active slide's index, for controlled usage. Pair with `onSlide` or `onSlid` to feed the
   * new index back — they're the only way a controlled carousel's `activeIndex` gets updated.
   */
  activeIndex?: number;
  /**
   * Let each CarouselItem size itself instead of dividing the track evenly; snap points still land on every slide.
   */
  auto?: boolean;
  /**
   * Cycle through slides automatically on mount.
   */
  autoplay?: boolean;
  /**
   * Snap the active slide to the center of the viewport instead of its start.
   */
  center?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The active slide's index, for uncontrolled usage.
   */
  defaultActiveIndex?: number;
  /**
   * Behavior at the first/last slide. `loop` continues seamlessly past the ends for a single-slide layout, falling back to `wrap` for multi-item, peek, centered, or variable-width layouts, and under reduced motion. `wrap` jumps from the last slide back to the first, and vice versa. `stop` hard-stops and disables the previous/next controls at each end.
   */
  ends?: CarouselEnds;
  /**
   * Milliseconds to wait before automatically advancing to the next slide. Override per slide with CarouselItem's own `interval` prop.
   */
  interval?: number;
  /**
   * Number of whole slides visible per view, applied as the `--cx-carousel-items` custom property.
   */
  items?: number;
  /**
   * Space between slides, applied as the `--cx-carousel-items-gap` custom property.
   */
  itemsGap?: string;
  /**
   * How much of the neighboring slides to reveal, applied as the `--cx-carousel-items-peek` custom property.
   */
  itemsPeek?: string;
  /**
   * Move to the previous/next slide with the Left/Right arrow keys while focus is inside the carousel.
   */
  keyboard?: boolean;
  /**
   * Callback fired once a slide transition completes.
   */
  onSlid?: (detail: CarouselSlideDetail) => void;
  /**
   * Callback fired when a slide transition begins.
   */
  onSlide?: (detail: CarouselSlideDetail) => void;
  /**
   * Pause autoplay on `mouseenter`, resuming on `mouseleave`. Set to `false` to disable pause-on-hover.
   */
  pause?: 'hover' | false;
  /**
   * Replace the scroll transition with a crossfade.
   */
  transition?: CarouselTransition;
}
declare const Carousel: React.ForwardRefExoticComponent<CarouselProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/carousel/CarouselControlNext.d.ts
interface CarouselControlNextProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The accessible label announced by assistive technology.
   */
  label?: string;
}
declare const CarouselControlNext: React.ForwardRefExoticComponent<CarouselControlNextProps & React.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/carousel/CarouselControlPrev.d.ts
interface CarouselControlPrevProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The accessible label announced by assistive technology.
   */
  label?: string;
}
declare const CarouselControlPrev: React.ForwardRefExoticComponent<CarouselControlPrevProps & React.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/carousel/CarouselIndicators.d.ts
interface CarouselIndicatorsProps extends HTMLAttributes<HTMLOListElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Accessible label for each indicator button. Receives the slide's 1-based position.
   */
  label?: (position: number) => string;
}
declare const CarouselIndicators: React.ForwardRefExoticComponent<CarouselIndicatorsProps & React.RefAttributes<HTMLOListElement>>;
//#endregion
//#region src/components/carousel/CarouselInner.d.ts
type CarouselInnerOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CarouselInnerProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CarouselInnerOwnProps<C>>;
type CarouselInnerComponent = (<C extends ElementType = 'div'>(props: CarouselInnerProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CarouselInner: CarouselInnerComponent;
//#endregion
//#region src/components/carousel/CarouselItem.d.ts
type CarouselItemOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Milliseconds to wait before autoplay advances past this slide, overriding the carousel's own `interval`.
   */
  interval?: number;
};
type CarouselItemProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CarouselItemOwnProps<C>>;
type CarouselItemComponent = (<C extends ElementType = 'div'>(props: CarouselItemProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CarouselItem: CarouselItemComponent;
//#endregion
//#region src/components/carousel/CarouselOverlay.d.ts
type CarouselOverlayOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type CarouselOverlayProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, CarouselOverlayOwnProps<C>>;
type CarouselOverlayComponent = (<C extends ElementType = 'div'>(props: CarouselOverlayProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CarouselOverlay: CarouselOverlayComponent;
//#endregion
//#region src/components/carousel/CarouselPlayPause.d.ts
interface CarouselPlayPauseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The accessible label announced while autoplay is running.
   */
  pauseLabel?: string;
  /**
   * The accessible label announced while autoplay is stopped.
   */
  playLabel?: string;
}
/**
 * A discoverable toggle so a viewer can stop an autoplaying carousel, as required by WCAG 2.2
 * Success Criterion 2.2.2 (Pause, Stop, Hide). Reflects the current state automatically — a pause
 * icon while playing, a play icon once stopped.
 */
declare const CarouselPlayPause: React.ForwardRefExoticComponent<CarouselPlayPauseProps & React.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/collapse/Collapse.d.ts
interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Set horizontal collapsing to transition the width instead of height.
   */
  horizontal?: boolean;
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void;
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void;
  /**
   * Toggle the visibility of component.
   */
  visible?: boolean;
}
declare const Collapse: React.ForwardRefExoticComponent<CollapseProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/chip-input/ChipInput.d.ts
interface ChipInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * An accessible label for the chip group, used when there's no visible `<label>`.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible `<label>` element for the chip group.
   */
  'aria-labelledby'?: string;
  /**
   * Allow the same value to be added more than once. Defaults to `false`.
   */
  allowDuplicates?: boolean;
  /**
   * Space-separated chassis-css chip modifier classes (e.g. `"primary smooth"`) applied to every
   * chip. Defaults to `"default"`.
   */
  chipVariant?: string;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The initial set of chip values (uncontrolled).
   */
  defaultValue?: string[];
  /**
   * Prevents new chips from being added and makes existing chips non-interactive.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the chips.
   */
  help?: ReactNode;
  /**
   * `id` forwarded to the text input — useful for pairing with a `<label for>`.
   */
  id?: string;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the chips when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with the text input.
   */
  label?: ReactNode;
  /**
   * Maximum number of chips allowed. Omit for no limit.
   */
  maxChips?: number;
  /**
   * `name` of an auto-created hidden input per chip, kept in sync with the values, for native
   * form submission. Omit to skip creating them.
   */
  name?: string;
  /**
   * Callback fired whenever a chip is added or removed.
   */
  onChange?: (values: string[]) => void;
  /**
   * Placeholder shown in the input when empty.
   */
  placeholder?: string;
  /**
   * Character that creates a new chip when typed, or pasted text is split on. Set to `null` to
   * disable. Defaults to `,`.
   */
  separator?: null | string;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the chips when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The set of chip values (controlled).
   */
  value?: string[];
}
declare const ChipInput: React.ForwardRefExoticComponent<ChipInputProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/close-button/CloseButton.d.ts
type CloseButtonOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors. Applies the
   * `context` class alongside it, so the icon picks up that color without needing
   * an ancestor `.context` wrapper.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * A custom HTML tag (e.g. `'span'`) gets button semantics — role, focus, Enter/Space
   * activation — filled in automatically. A component is trusted to handle its own semantics,
   * so pass one that's already interactive (e.g. `Button`).
   */
  component?: C;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * The href attribute specifies the URL of the page the link goes to. Only meaningful when
   * `component` is `'a'`.
   */
  href?: string;
  /**
   * The accessible label announced by assistive technology. Override this to
   * localize the button for non-English contexts.
   */
  label?: string;
  /**
   * Fires on click. Typed for every element `component` can actually render (`button` or `a`
   * natively, plus whatever a custom `component` renders), rather than narrowed to
   * `HTMLButtonElement` alone.
   */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Specifies the type of button. Always specify the type attribute for the `<button>` element.
   * Different browsers may use different default types for the `<button>` element.
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * Set the close button's context style variant. Applies the `context` class
   * alongside it, same as `color`.
   */
  variant?: ContextStyle;
};
type CloseButtonProps<C extends ElementType = 'button'> = PolymorphicComponentProps<C, CloseButtonOwnProps<C>>;
type CloseButtonComponent = (<C extends ElementType = 'button'>(props: CloseButtonProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const CloseButton: CloseButtonComponent;
//#endregion
//#region src/components/color-input/ColorInput.d.ts
interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The value of the input, uncontrolled.
   */
  defaultValue?: string;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the input.
   */
  help?: ReactNode;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the input when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with this input.
   */
  label?: ReactNode;
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the input when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: string;
}
declare const ColorInput: React.ForwardRefExoticComponent<ColorInputProps & React.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/file-input/FileInput.d.ts
interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the input.
   */
  help?: ReactNode;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the input when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with this input.
   */
  label?: ReactNode;
  /**
   * Allows selecting more than one file.
   */
  multiple?: boolean;
  /**
   * Method called when the selected file(s) change.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the input when `valid` is set.
   */
  validFeedback?: ReactNode;
}
declare const FileInput: React.ForwardRefExoticComponent<FileInputProps & React.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/combobox/Combobox.d.ts
interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * An accessible label for the combobox, used when there's no visible `<label>`.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible `<label>` element for the combobox.
   */
  'aria-labelledby'?: string;
  /**
   * `ComboboxItem` elements, optionally wrapped in `ComboboxGroup` — read as data by
   * `Combobox` to build the option list. Not rendered directly. Ignored when `items` is set.
   */
  children?: ReactNode;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The initial selected option's id (uncontrolled).
   */
  defaultValue?: Key$2 | null;
  /**
   * Prevents the combobox from being focused or interacted with.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the combobox.
   */
  help?: ReactNode;
  /**
   * `id` forwarded to the input element — useful for pairing with a `<label for>`.
   */
  id?: string;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the combobox when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. A `'header'` entry starts a group that all following items join until the next
   * header or the end of the array. `'divider'` entries are a no-op here (dividers aren't
   * meaningful for a listbox/option collection) — use `ComboboxGroup` composition instead if
   * you need finer control over grouping. An entry's `href`/`onClick` are `Menu`-only and are not
   * read here — use `onChange` to react to the selection instead.
   */
  items?: MenuItemsDef;
  /**
   * The field's caption, rendered as a `FormLabel` associated with the input.
   */
  label?: ReactNode;
  /**
   * `name` of an auto-created hidden input, kept in sync with the selection, for native form
   * submission. Omit to skip creating one.
   */
  name?: string;
  /**
   * Text shown in the listbox when no options match the current query.
   */
  noResultsText?: ReactNode;
  /**
   * Callback fired when the selected option changes.
   */
  onChange?: (value: Key$2 | null) => void;
  /**
   * Placeholder shown in the input when nothing is selected.
   */
  placeholder?: string;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the combobox when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The selected option's id (controlled).
   */
  value?: Key$2 | null;
}
declare const Combobox: React.ForwardRefExoticComponent<ComboboxProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/datepicker/DatePicker.d.ts
interface DatePickerBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * An accessible label for the date picker, used when there's no visible `<label>`.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible `<label>` element for the date picker.
   */
  'aria-labelledby'?: string;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Whether the calendar popover is open by default (uncontrolled).
   *
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Prevents the date picker from being focused or interacted with.
   */
  disabled?: boolean;
  /**
   * The day that starts the week in the calendar overlay, overriding the default set by the
   * active locale.
   *
   * @default 'mon'
   */
  firstDayOfWeek?: 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';
  /**
   * A description for the field, rendered below the date picker.
   */
  help?: ReactNode;
  /**
   * `id` forwarded to the field's grouping element — useful for pairing with a `<label for>`.
   */
  id?: string;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the date picker when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue$1) => boolean;
  /**
   * Whether the calendar popover is open (controlled).
   */
  isOpen?: boolean;
  /**
   * The field's caption, rendered as a `FormLabel` associated with the field group.
   */
  label?: ReactNode;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue$1 | null;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue$1 | null;
  /**
   * `name` of an auto-created hidden input, kept in sync with the selection, for native form
   * submission — one input when `selectionMode` is `'single'`, one per selected date when it's
   * `'multiple'` (same `name` on each, which browsers serialize as multiple form values). Omit to
   * skip creating any.
   */
  name?: string;
  /**
   * Callback fired when the calendar popover's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   * Applies to both the calendar overlay and typing a date directly into the field.
   */
  unavailableDates?: string[];
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the date picker when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * Number of months to display side by side in the calendar overlay.
   *
   * @default 1
   */
  visibleMonths?: number;
}
interface DatePickerSingleProps extends DatePickerBaseProps {
  /**
   * The initial selected date (uncontrolled).
   */
  defaultValue?: DateValue$1 | null;
  /**
   * Callback fired when the selected date changes.
   */
  onChange?: (value: DateValue$1 | null) => void;
  /**
   * Whether a single date or multiple, independently toggled dates can be selected. Multiple
   * selection replaces the editable segmented field with a read-only, comma-separated list of
   * the selected dates — a segmented day/month/year field has no way to represent more than one
   * date.
   *
   * @default 'single'
   */
  selectionMode?: 'single';
  /**
   * The selected date (controlled).
   */
  value?: DateValue$1 | null;
}
interface DatePickerMultipleProps extends DatePickerBaseProps {
  /**
   * The initial selected dates (uncontrolled).
   */
  defaultValue?: DateValue$1[] | null;
  /**
   * Callback fired when the set of selected dates changes.
   */
  onChange?: (value: DateValue$1[]) => void;
  /**
   * Whether a single date or multiple, independently toggled dates can be selected. Multiple
   * selection replaces the editable segmented field with a read-only, comma-separated list of
   * the selected dates — a segmented day/month/year field has no way to represent more than one
   * date.
   *
   * @default 'single'
   */
  selectionMode: 'multiple';
  /**
   * The selected dates (controlled).
   */
  value?: DateValue$1[] | null;
}
type DatePickerProps = DatePickerMultipleProps | DatePickerSingleProps;
declare const DatePicker: React.ForwardRefExoticComponent<DatePickerProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/datepicker/DateRangePicker.d.ts
interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * An accessible label for the date range picker, used when there's no visible `<label>`.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible `<label>` element for the date range picker.
   */
  'aria-labelledby'?: string;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Whether the calendar popover is open by default (uncontrolled).
   *
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * The initial selected date range (uncontrolled).
   */
  defaultValue?: RangeValue<DateValue$1> | null;
  /**
   * Prevents the date range picker from being focused or interacted with.
   */
  disabled?: boolean;
  /**
   * The day that starts the week in the calendar overlay, overriding the default set by the
   * active locale.
   *
   * @default 'mon'
   */
  firstDayOfWeek?: 'fri' | 'mon' | 'sat' | 'sun' | 'thu' | 'tue' | 'wed';
  /**
   * A description for the field, rendered below the date range picker.
   */
  help?: ReactNode;
  /**
   * `id` forwarded to the field's grouping element — useful for pairing with a `<label for>`.
   */
  id?: string;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the date range picker when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * Callback that is called for each date in the calendar. If it returns `true`, that date is
   * shown but cannot be selected.
   */
  isDateUnavailable?: (date: DateValue$1) => boolean;
  /**
   * Whether the calendar popover is open (controlled).
   */
  isOpen?: boolean;
  /**
   * The field's caption, rendered as a `FormLabel` associated with the field group.
   */
  label?: ReactNode;
  /**
   * The maximum allowed date that a user may select.
   */
  maxValue?: DateValue$1 | null;
  /**
   * The minimum allowed date that a user may select.
   */
  minValue?: DateValue$1 | null;
  /**
   * Base `name` for a pair of auto-created hidden inputs, kept in sync with the selection, for
   * native form submission — rendered as `${name}Start` and `${name}End`. Omit to skip creating
   * them.
   */
  name?: string;
  /**
   * Callback fired when the selected date range changes.
   */
  onChange?: (value: RangeValue<DateValue$1> | null) => void;
  /**
   * Callback fired when the calendar popover's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * A list of quick-select range presets shown in the overlay next to the calendar. Selecting a
   * preset commits its range immediately, the same as picking a start and end date from the
   * calendar. The preset matching the current selection (if any) is marked selected. Omit to not
   * show a preset list.
   */
  presets?: DateRangePreset[];
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * ISO 8601 dates (`YYYY-MM-DD`) to mark unselectable, as a convenience alternative to
   * `isDateUnavailable` for data-driven cases (e.g. booked dates fetched from an API). Composed
   * with `isDateUnavailable` when both are given — a date unavailable by either is unavailable.
   * Applies to both the calendar overlay and typing a date directly into either field.
   */
  unavailableDates?: string[];
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the date range picker when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The selected date range (controlled).
   */
  value?: RangeValue<DateValue$1> | null;
  /**
   * Number of months to display side by side in the calendar overlay.
   *
   * @default 1
   */
  visibleMonths?: number;
}
declare const DateRangePicker: React.ForwardRefExoticComponent<DateRangePickerProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/otp-input/OtpInput.d.ts
interface OtpInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * Identifies the element that describes the group, e.g. a `FormHelp` help element.
   */
  'aria-describedby'?: string;
  /**
   * An accessible label for the group, used when there's no visible `<label>`.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible `<label>` element for the group.
   */
  'aria-labelledby'?: string;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The initial code (uncontrolled), e.g. `"123"` for a partially filled code.
   */
  defaultValue?: string;
  /**
   * Prevents input and makes every box non-interactive.
   */
  disabled?: boolean;
  /**
   * Splits the boxes into groups (e.g. `[3, 3]` for a "123-456" layout), rendering a
   * `.form-otp-separator` between each group. The total number of boxes becomes the sum of
   * `groupSizes`, overriding `length`.
   */
  groupSizes?: number[];
  /**
   * A description for the field, rendered below the boxes.
   */
  help?: ReactNode;
  /**
   * `id` forwarded to the group container.
   */
  id?: string;
  /**
   * Visually connects the boxes into a single bordered control. When `groupSizes` is set, each
   * group is connected separately.
   */
  inputGroup?: boolean;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the boxes when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with the group via
   * `aria-labelledby` (there's no single input to target with `htmlFor`).
   */
  label?: ReactNode;
  /**
   * Number of digit boxes. Ignored when `groupSizes` is set. Defaults to `6`.
   */
  length?: number;
  /**
   * Mask entered digits using `type="password"` boxes.
   */
  mask?: boolean;
  /**
   * `name` of an auto-created hidden input kept in sync with the code, for native form
   * submission. Omit to skip creating it.
   */
  name?: string;
  /**
   * Callback fired whenever the code changes.
   */
  onChange?: (value: string) => void;
  /**
   * Callback fired once every box is filled.
   */
  onComplete?: (value: string) => void;
  /**
   * Content of the separator rendered between groups when `groupSizes` is set. Defaults to `–`.
   */
  separator?: ReactNode;
  /**
   * Size the boxes small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the boxes when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The code (controlled), digits only, e.g. `"123456"`.
   */
  value?: string;
}
declare const OtpInput: React.ForwardRefExoticComponent<OtpInputProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/password-strength/strengthScore.d.ts
type StrengthLevel = 'fair' | 'good' | 'strong' | 'weak';
interface StrengthWeights {
  extraLength: number;
  lowercase: number;
  longPassword: number;
  minLength: number;
  multipleSpecial: number;
  numbers: number;
  special: number;
  uppercase: number;
}
//#endregion
//#region src/components/password-strength/PasswordStrength.d.ts
interface PasswordStrengthProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * An accessible label for the meter. Defaults to `"Password strength"`.
   */
  'aria-label'?: string;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * `id` forwarded to the meter element.
   */
  id?: string;
  /**
   * The maximum possible score, used to compute the meter's `aria-valuemax`. Defaults to the sum
   * of `weights`' values — set this explicitly when pairing a custom `scorer` whose scale doesn't
   * match the built-in criteria weights, otherwise `aria-valuenow`/`aria-valuemax` get silently
   * clamped to the built-in max.
   */
  maxScore?: number;
  /**
   * Minimum password length required to earn the first strength point. Defaults to `8`.
   */
  minLength?: number;
  /**
   * Feedback message shown for each strength level, when `showText` is `true`.
   */
  messages?: Partial<Record<StrengthLevel, string>>;
  /**
   * Callback fired whenever the strength level changes, including once on mount with the
   * initial `value`'s strength.
   */
  onStrengthChange?: (result: {
    score: number;
    strength: StrengthLevel | null;
  }) => void;
  /**
   * Custom scoring function overriding the built-in criteria. Receives the password and returns
   * a numeric score.
   */
  scorer?: (password: string) => number;
  /**
   * Renders a `.strength-text` element below the meter with the current level's message.
   * Defaults to `true`.
   */
  showText?: boolean;
  /**
   * Score boundaries `[weak, fair, good]` — scores above the last value are `"strong"`. Defaults
   * to `[2, 4, 6]`.
   */
  thresholds?: [number, number, number];
  /**
   * The current password value to evaluate.
   */
  value: string;
  /**
   * Render as four discrete segments, or a single growing bar. Defaults to `"segmented"`.
   */
  variant?: 'bar' | 'segmented';
  /**
   * Point values for each scoring criterion. Set a criterion to `0` to disable it. Merged with
   * the built-in defaults.
   */
  weights?: Partial<StrengthWeights>;
}
declare const PasswordStrength: {
  ({ "aria-label": ariaLabel, className, id, maxScore, messages, minLength, onStrengthChange, scorer, showText, thresholds, value, variant, weights, ...rest }: PasswordStrengthProps): React.JSX.Element;
  displayName: string;
};
//#endregion
//#region src/utils/overlayPlacement.d.ts
type Placement = 'bottom' | 'bottom-end' | 'bottom-start' | 'left' | 'left-end' | 'left-start' | 'right' | 'right-end' | 'right-start' | 'top' | 'top-end' | 'top-start';
//#endregion
//#region src/components/menu/Menu.d.ts
type MenuAutoClose = 'inside' | 'outside' | boolean;
type MenuOwnProps<C extends ElementType> = {
  /**
   * Controls which clicks close the menu. `true` closes on any click inside or outside.
   * `false` requires a programmatic `visible` change. `'inside'` closes only on click inside
   * the menu. `'outside'` closes only on click outside the menu.
   */
  autoClose?: MenuAutoClose;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `Fragment` — `MenuToggle`/`MenuList` render with no wrapping element, so
   * they land as direct children of whatever contains the `Menu`. This matters inside
   * `ButtonGroup`/`InputGroup`, whose CSS expects the toggle button and menu panel as direct
   * children rather than nested inside an intermediate node.
   *
   * Pass an actual element (e.g. `"div"`, or `"li"` for a navbar item) to opt back into a
   * wrapper — needed if you want to apply `className`/`style`/other rest props to a container
   * around the whole menu, for semantic wrapping like a nav `<li>`, or for `reference="parent"`,
   * which positions off this wrapper and has nothing to measure against without one.
   */
  component?: C;
  /**
   * Teleports the menu panel to a container element on open. Accepts an element reference, or
   * `true` to append to `document.body`.
   */
  container?: Element | boolean;
  /**
   * Distance between the menu and its reference element, as `[skidding, distance]` in pixels.
   */
  offset?: [number, number];
  /**
   * Callback fired when the menu requests to be hidden.
   */
  onHide?: () => void;
  /**
   * Callback fired after the menu finishes hiding.
   */
  onHidden?: () => void;
  /**
   * Callback fired when the menu requests to be shown.
   */
  onShow?: () => void;
  /**
   * Callback fired after the menu finishes showing.
   */
  onShown?: () => void;
  /**
   * Initial placement. Chassis will flip it to keep the menu in view.
   *
   * @type 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
   */
  placement?: Placement;
  /**
   * Reference element used for positioning. `'toggle'` uses the trigger. `'parent'` uses this
   * component's own rendered element, useful for split buttons and button groups.
   */
  reference?: 'parent' | 'toggle';
  /**
   * Toggle the visibility of the menu component.
   */
  visible?: boolean;
};
type MenuProps<C extends ElementType = typeof Fragment> = PolymorphicComponentProps<C, MenuOwnProps<C>>;
type MenuComponent = (<C extends ElementType = typeof Fragment>(props: MenuProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Menu: MenuComponent;
//#endregion
//#region src/components/menu/MenuDivider.d.ts
interface MenuDividerProps extends HTMLAttributes<HTMLHRElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
}
declare const MenuDivider: React.ForwardRefExoticComponent<MenuDividerProps & React.RefAttributes<HTMLHRElement>>;
//#endregion
//#region src/components/menu/MenuHeader.d.ts
type MenuHeaderOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * ARIA role applied to the root node. Defaults to `'presentation'` — see the render function
   * for why.
   */
  role?: React.AriaRole;
};
type MenuHeaderProps<C extends ElementType = 'h4'> = PolymorphicComponentProps<C, MenuHeaderOwnProps<C>>;
type MenuHeaderComponent = (<C extends ElementType = 'h4'>(props: MenuHeaderProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const MenuHeader: MenuHeaderComponent;
//#endregion
//#region src/components/menu/MenuItem.d.ts
type MenuItemOwnProps = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Secondary line of text rendered below `children` (`.menu-item-description`).
   */
  description?: ReactNode;
  /**
   * Icon rendered at the item's leading edge (`.menu-item-icon`).
   */
  icon?: ReactNode;
  /**
   * Marks the item as the current selection in a choice list. Renders in a heavier font weight.
   * Combine with a manually-composed `.menu-item-check` icon (in `children`, or via `icon` on a
   * plain, non-selection item) to also show a checkmark — this prop alone doesn't add one, so
   * existing font-weight-only usage keeps rendering unchanged.
   */
  selected?: boolean;
};
type MenuItemProps<C extends ElementType = 'a'> = LinkProps<C> & MenuItemOwnProps;
type MenuItemComponent = (<C extends ElementType = 'a'>(props: MenuItemProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const MenuItem: MenuItemComponent;
//#endregion
//#region src/components/menu/MenuList.d.ts
type MenuListOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. Covers flat items, headers, and dividers only — for nested submenus, compose
   * with `children` and `MenuSubmenu` instead.
   */
  items?: MenuItemsDef;
};
type MenuListProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, MenuListOwnProps<C>>;
type MenuListComponent = (<C extends ElementType = 'div'>(props: MenuListProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const MenuList: MenuListComponent;
//#endregion
//#region src/components/menu/MenuText.d.ts
type MenuTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type MenuTextProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, MenuTextOwnProps<C>>;
type MenuTextComponent = (<C extends ElementType = 'span'>(props: MenuTextProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const MenuText: MenuTextComponent;
//#endregion
//#region src/components/menu/MenuToggle.d.ts
type MenuToggleOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors. Only applies to the
   * default `Button` root.
   */
  color?: ContextColor;
  /**
   * Component used for the root node — the trigger element the menu opens from. Defaults to
   * `Button`; swap for e.g. `NavLink` to render a nav-item-style trigger (`.nav-link.caret`)
   * instead of a `.button.caret`. Its own props are type-checked at the call site once passed
   * here.
   */
  component?: C;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * The href attribute specifies the URL of the page the link goes to.
   */
  href?: string;
  /**
   * Select the shape of the component. Only applies to the default `Button` root.
   */
  shape?: Shapes;
  /**
   * Size the component small or large. Only applies to the default `Button` root.
   */
  size?: 'large' | 'small';
  /**
   * Sets the context style of the component. Only applies to the default `Button` root.
   */
  variant?: ContextStyle;
};
type MenuToggleProps<C extends ElementType = typeof Button> = PolymorphicComponentProps<C, MenuToggleOwnProps<C>>;
type MenuToggleComponent = (<C extends ElementType = typeof Button>(props: MenuToggleProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const MenuToggle: MenuToggleComponent;
//#endregion
//#region src/components/menu/MenuSubmenu.d.ts
interface MenuSubmenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /**
   * MenuSubmenu activation mode on hover-capable devices. `'click'` activates on click only.
   * `'hover'` activates on hover only. `'both'` (the default) activates on both. Touch
   * devices always use tap regardless of this setting.
   */
  activation?: 'both' | 'click' | 'hover';
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Prevents the submenu from opening.
   */
  disabled?: boolean;
  /**
   * Distance between the nested menu and the trigger, as `[skidding, distance]` in pixels.
   */
  offset?: [number, number];
  /**
   * Placement of the nested menu relative to the trigger. Defaults to cascading in the reading
   * direction — `'right-start'` under LTR locales, `'left-start'` under RTL ones (see
   * `useLocale`) — matching native OS/browser submenu behavior. An explicit value always wins
   * over that locale-based default.
   */
  placement?: Placement;
  /**
   * Switches to a view-replacement pattern below the `small` breakpoint. Pair with a
   * `MenuSubmenuBack` as the first item of the nested menu.
   */
  stacked?: boolean;
  /**
   * Milliseconds before closing the submenu when the pointer leaves it.
   */
  submenuDelay?: number;
  /**
   * Content of the `.menu-item` trigger that opens the submenu.
   */
  trigger: ReactNode;
}
declare const MenuSubmenu: React.ForwardRefExoticComponent<MenuSubmenuProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/menu/MenuSubmenuBack.d.ts
interface MenuSubmenuBackProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
}
declare const MenuSubmenuBack: React.ForwardRefExoticComponent<MenuSubmenuBackProps & React.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/grid/Col.d.ts
interface ColLayout {
  /**
   * Columns (of 12) this Col spans, or `'auto'`/`true` for a natural-width column.
   *
   * @type { 'auto' | number | string | boolean }
   */
  span?: Span;
  /**
   * Columns to offset the start of this Col by.
   */
  offset?: number | string;
  /**
   * Visual order relative to sibling columns.
   *
   * @type { 'first' | 'last' | number | string }
   */
  order?: 'first' | 'last' | number | string;
}
interface ColProps extends HTMLAttributes<HTMLDivElement>, ColLayout {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Overrides `span`/`offset`/`order` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', { span?: 'auto' | number | string | boolean, offset?: number | string, order?: 'first' | 'last' | number | string }>> }
   */
  responsive?: Partial<Record<Breakpoint, ColLayout>>;
}
declare const Col: React.ForwardRefExoticComponent<ColProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/grid/Container.d.ts
type ContainerOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Set container 100% wide until the given breakpoint, after which it scales up with `max-width`
   * at every larger breakpoint.
   *
   * @type Breakpoint
   */
  fluidUntil?: Breakpoint;
  /**
   * Set container 100% wide, spanning the entire width of the viewport.
   */
  fluid?: boolean;
};
type ContainerProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ContainerOwnProps<C>>;
type ContainerComponent = (<C extends ElementType = 'div'>(props: ContainerProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Container: ContainerComponent;
//#endregion
//#region src/components/grid/Grid.d.ts
type GridOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Number of columns in the grid template, set via the `--cx-grid-columns` custom property
   * (defaults to `12` in CSS when omitted). Has no effect when `fill` is set.
   */
  columns?: number;
  /**
   * Number of rows in the grid template, set via the `--cx-grid-rows` custom property (defaults
   * to `1` in CSS when omitted). Has no effect when `fill` is set.
   */
  rows?: number;
  /**
   * Gap between grid items, set via the `--cx-grid-gap` custom property (or `--cx-gap` when
   * `fill` is set). Accepts a `Spacing` token (mapped to the matching `--cx-space-*` custom
   * property) or any raw CSS `gap` value, including a `"{row} {column}"` pair.
   *
   * @type { Spacing | string }
   */
  gap?: (string & {}) | Spacing;
  /**
   * Renders `.grid-fill` instead of `.grid` — columns expand equally to fill the available
   * width, with the column count determined by the number of children rather than `columns`.
   */
  fill?: boolean;
};
type GridProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, GridOwnProps<C>>;
type GridComponent = (<C extends ElementType = 'div'>(props: GridProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Grid: GridComponent;
//#endregion
//#region src/components/grid/GridItem.d.ts
interface GridItemLayout {
  /**
   * Number of grid column tracks (of the parent `<Grid>`'s `columns`) this item spans, mapped to
   * the `g-col-{n}` class.
   */
  span?: number;
  /**
   * Grid column line to start this item at, mapped to the `g-start-{n}` class.
   */
  start?: number;
}
type GridItemOwnProps<C extends ElementType> = GridItemLayout & {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Overrides `span`/`start` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', { span?: number, start?: number }>> }
   */
  responsive?: Partial<Record<Breakpoint, GridItemLayout>>;
  /**
   * Turns this item into a nested subgrid: adds `.grid`/`.grid-cols-subgrid` alongside its
   * `g-col-{n}`/`g-start-{n}` placement classes, so its own children inherit the parent
   * `<Grid>`'s column tracks instead of defining new ones. Combine with `span` — a subgrid
   * item must itself be a grid item of the parent for `grid-template-columns: subgrid` to take
   * effect, which is why `subgrid` lives on `<GridItem>` (the element actually placed as a grid
   * item) rather than on a `<Grid>` nested inside it.
   */
  subgrid?: boolean;
  /**
   * Number of rows in the subgrid's own row template, set via the `--cx-grid-rows` custom
   * property (defaults to `1` in CSS when omitted). Only relevant when `subgrid` is set —
   * subgrid only inherits the parent's column tracks, not its rows.
   */
  rows?: number;
  /**
   * Gap between the subgrid's children, set via the `--cx-grid-gap` custom property. Only
   * relevant when `subgrid` is set — a subgrid doesn't inherit its parent's gap.
   *
   * @type { Spacing | string }
   */
  gap?: (string & {}) | Spacing;
};
type GridItemProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, GridItemOwnProps<C>>;
type GridItemComponent = (<C extends ElementType = 'div'>(props: GridItemProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const GridItem: GridItemComponent;
//#endregion
//#region src/components/grid/Row.d.ts
interface RowLayout {
  /**
   * Equal-width columns per row, or `'auto'` for content-sized columns.
   *
   * @type { 'auto' | number | string }
   */
  cols?: 'auto' | number | string;
  /**
   * Gutter width on both axes.
   *
   * @type { Spacing | 0 }
   */
  gutter?: 0 | Spacing;
  /**
   * Horizontal gutter width.
   *
   * @type { Spacing | 0 }
   */
  gutterX?: 0 | Spacing;
  /**
   * Vertical gutter width.
   *
   * @type { Spacing | 0 }
   */
  gutterY?: 0 | Spacing;
}
interface RowProps extends HTMLAttributes<HTMLDivElement>, RowLayout {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Overrides `cols`/`gutter`/`gutterX`/`gutterY` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', { cols?: 'auto' | number | string, gutter?: Spacing | 0, gutterX?: Spacing | 0, gutterY?: Spacing | 0 }>> }
   */
  responsive?: Partial<Record<Breakpoint, RowLayout>>;
}
declare const Row: React.ForwardRefExoticComponent<RowProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/form/renderFormCheck.d.ts
type ButtonObject = {
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Select the shape of the component.
   */
  shape?: Shapes;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set the button variant to an outlined button or a ghost button.
   */
  variant?: 'ghost' | 'outline';
};
//#endregion
//#region src/components/checkbox/Checkbox.d.ts
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'defaultChecked' | 'onChange' | 'size'> {
  /**
   * Create button-like checkboxes.
   */
  button?: ButtonObject;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the check indicator to one of Chassis context colors. Ignored when `button` is set.
   */
  color?: ContextColor;
  /**
   * Whether the checkbox is selected, uncontrolled. Ignored when rendered inside a `<CheckboxGroup>` —
   * the group's `value`/`defaultValue` owns selection there.
   */
  defaultSelected?: boolean;
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string;
  /**
   * Checkbox indeterminate property.
   */
  indeterminate?: boolean;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * Whether the checkbox is selected, controlled. Ignored when rendered inside a `<CheckboxGroup>` —
   * the group's `value`/`defaultValue` owns selection there.
   */
  isSelected?: boolean;
  /**
   * The element represents a caption for a component.
   */
  label?: ReactNode;
  /**
   * Callback fired when the selected state changes. Ignored when rendered inside a `<CheckboxGroup>` —
   * use the group's `onChange` instead.
   */
  onChange?: (isSelected: boolean) => void;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * The value of the checkbox, used when submitting an HTML form. Required when rendered inside a
   * `<CheckboxGroup>` — it identifies this item within the group's selected values.
   */
  value?: string;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/checkbox/CheckboxGroup.d.ts
interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'defaultValue' | 'onChange'> {
  /**
   * One or more `<Checkbox>` elements.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The selected values, uncontrolled.
   */
  defaultValue?: string[];
  /**
   * A description for the group, rendered below the options.
   */
  description?: ReactNode;
  /**
   * Disables every checkbox in the group.
   */
  disabled?: boolean;
  /**
   * An error message for the group, rendered below the options when `invalid` is set.
   */
  errorMessage?: ReactNode;
  /**
   * Set group validation state to invalid.
   */
  invalid?: boolean;
  /**
   * The group's caption, rendered as a `<legend>`.
   */
  label?: ReactNode;
  /**
   * The name for the group, used for native form submission.
   */
  name?: string;
  /**
   * Callback fired when the selected values change.
   */
  onChange?: (value: string[]) => void;
  /**
   * Lay the group's checkboxes out on the same horizontal row instead of stacking them.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Marks the group as required.
   */
  required?: boolean;
  /**
   * Set group validation state to valid.
   */
  valid?: boolean;
  /**
   * The selected values, controlled.
   */
  value?: string[];
}
declare const CheckboxGroup: React.ForwardRefExoticComponent<CheckboxGroupProps & React.RefAttributes<HTMLFieldSetElement>>;
//#endregion
//#region src/components/form/Form.d.ts
interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Mark a form as validated. If you set it `true`, all validation styles will be applied to the forms component.
   */
  validated?: boolean;
}
declare const Form: React.ForwardRefExoticComponent<FormProps & React.RefAttributes<HTMLFormElement>>;
//#endregion
//#region src/components/form/FormLabel.d.ts
interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * A string of all className you want to be applied to the component, and override standard className value.
   */
  customClassName?: string;
}
declare const FormLabel: React.ForwardRefExoticComponent<FormLabelProps & React.RefAttributes<HTMLLabelElement>>;
//#endregion
//#region src/components/form/FormHelp.d.ts
type FormHelpOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type FormHelpProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, FormHelpOwnProps<C>>;
type FormHelpComponent = (<C extends ElementType = 'div'>(props: FormHelpProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const FormHelp: FormHelpComponent;
//#endregion
//#region src/components/form/FormFeedback.d.ts
type FormFeedbackOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * If your form layout allows it, you can display validation feedback in a styled tooltip.
   */
  tooltip?: boolean;
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
};
type FormFeedbackProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, FormFeedbackOwnProps<C>>;
type FormFeedbackComponent = (<C extends ElementType = 'div'>(props: FormFeedbackProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const FormFeedback: FormFeedbackComponent;
//#endregion
//#region src/components/form-field/renderFormField.d.ts
interface FormFieldIds {
  feedback?: string;
  help?: string;
  input?: string;
  /**
   * The label's own id, for controls with no single input to associate via `htmlFor` (e.g. a
   * multi-input group) — reference it from the control's own `aria-labelledby` instead.
   */
  label?: string;
}
//#endregion
//#region src/components/floating-input/FloatingInput.d.ts
interface FloatingInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The form control (e.g. a `TextInput`, `Select`, or `Textarea`) the floating label attaches
   * to. Chassis-css's floating-label CSS relies on a `label:has(~ .form-input)` selector, so this
   * must render an element carrying the `form-input` class as a direct child.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the `.form-floating` element.
   */
  className?: string;
  /**
   * A description for the field, rendered below the control. Setting this (or `invalidFeedback`/
   * `validFeedback`) wraps the floating input in a `.form-field`.
   */
  help?: ReactNode;
  /**
   * The DOM ids of the wrapped control, used to associate the label (`htmlFor`) and point your
   * control's own `aria-describedby` at the rendered help/feedback text.
   */
  ids?: FormFieldIds;
  /**
   * Set field validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the control when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a floating `FormLabel` associated with `ids.input`.
   */
  label: ReactNode;
  /**
   * Set field validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the control when `valid` is set.
   */
  validFeedback?: ReactNode;
}
declare const FloatingInput: React.ForwardRefExoticComponent<FloatingInputProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/form-field/FormField.d.ts
interface FormFieldProps {
  /**
   * The form control(s) this field wraps.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * A description for the field, rendered below the control(s).
   */
  help?: ReactNode;
  /**
   * The DOM ids of the wrapped control(s), used to associate the label (`htmlFor`) and
   * point your control's own `aria-describedby` at the rendered help/feedback text.
   */
  ids?: FormFieldIds;
  /**
   * Set field validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the control(s) when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with `ids.input`.
   */
  label?: ReactNode;
  /**
   * Set field validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the control(s) when `valid` is set.
   */
  validFeedback?: ReactNode;
}
declare const FormField: {
  ({ children, className, help, ids, invalid, invalidFeedback, label, valid, validFeedback }: FormFieldProps): ReactNode;
  displayName: string;
};
//#endregion
//#region src/components/input-group/InputGroup.d.ts
type InputGroupOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
};
type InputGroupProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, InputGroupOwnProps<C>>;
type InputGroupComponent = (<C extends ElementType = 'div'>(props: InputGroupProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const InputGroup: InputGroupComponent;
//#endregion
//#region src/components/input-group/InputGroupAddon.d.ts
type InputGroupAddonOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * The id of the form control this addon labels, when rendered as `component="label"`.
   */
  htmlFor?: string;
};
type InputGroupAddonProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, InputGroupAddonOwnProps<C>>;
type InputGroupAddonComponent = (<C extends ElementType = 'span'>(props: InputGroupAddonProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const InputGroupAddon: InputGroupAddonComponent;
//#endregion
//#region src/components/input-adorn/InputAdorn.d.ts
type InputAdornOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component. Use
   * `"button"` or `"a"` for an actionable adorn, e.g. a password reveal toggle or a clear button.
   */
  component?: C;
};
type InputAdornProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, InputAdornOwnProps<C>>;
type InputAdornComponent = (<C extends ElementType = 'span'>(props: InputAdornProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const InputAdorn: InputAdornComponent;
//#endregion
//#region src/components/radio/Radio.d.ts
interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'defaultChecked' | 'onChange' | 'size'> {
  /**
   * Create button-like radios. Combine with `<RadioGroup>` to build radio toggle-button groups.
   */
  button?: ButtonObject;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the radio indicator to one of Chassis context colors. Ignored when `button` is set.
   */
  color?: ContextColor;
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string;
  /**
   * The element represents a caption for a component.
   */
  label?: ReactNode;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * The value of the radio button, used to identify it within its `<RadioGroup>`.
   */
  value: string;
}
declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/radio/RadioGroup.d.ts
interface RadioGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'defaultValue' | 'onChange'> {
  /**
   * One or more `<Radio>` elements.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The selected value, uncontrolled.
   */
  defaultValue?: string;
  /**
   * A description for the group, rendered below the options.
   */
  description?: ReactNode;
  /**
   * Disables every radio in the group.
   */
  disabled?: boolean;
  /**
   * An error message for the group, rendered below the options when `invalid` is set.
   */
  errorMessage?: ReactNode;
  /**
   * Set group validation state to invalid.
   */
  invalid?: boolean;
  /**
   * The group's caption, rendered as a `<legend>`.
   */
  label?: ReactNode;
  /**
   * The name for the group, used for native form submission.
   */
  name?: string;
  /**
   * Callback fired when the selected value changes.
   */
  onChange?: (value: string) => void;
  /**
   * Lay the group's radios out on the same horizontal row instead of stacking them.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Marks the group as required.
   */
  required?: boolean;
  /**
   * Set group validation state to valid.
   */
  valid?: boolean;
  /**
   * The selected value, controlled.
   */
  value?: string;
}
declare const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps & React.RefAttributes<HTMLFieldSetElement>>;
//#endregion
//#region src/components/range-input/RangeInput.d.ts
interface RangeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the range input.
   */
  help?: ReactNode;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the range input when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with this range input.
   */
  label?: ReactNode;
  /**
   * Specifies the maximum value for the component.
   */
  max?: number;
  /**
   * Specifies the minimum value for the component.
   */
  min?: number;
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean;
  /**
   * Specifies the interval between legal numbers in the component.
   */
  step?: number;
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the range input when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: number | string;
}
declare const RangeInput: React.ForwardRefExoticComponent<RangeInputProps & React.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/select/Select.d.ts
interface SelectOptionDef {
  /**
   * Marks the option as disabled — it can't be clicked or reached via the keyboard.
   */
  disabled?: boolean;
  /**
   * Label text rendered inside the option. Falls back to the browser's default (the `value`,
   * stringified) when omitted.
   */
  label?: string;
  /**
   * Marks the option as selected by default (uncontrolled) — resolved into the select's own
   * `defaultValue`, and ignored when the select's `value`/`defaultValue` is set directly. Set on
   * more than one option only when `multiple` is also set on `Select` — otherwise, matching
   * native `<select>` behavior, only the last option with `selected` set wins.
   */
  selected?: boolean;
  /**
   * The option's value attribute.
   */
  value?: number | string;
}
interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * Content rendered at the select's trailing edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   * Clicking anywhere in the wrapper (other than an actionable adorn) opens the select, since the
   * native element itself no longer fills the wrapper's full width.
   */
  adornEnd?: ReactNode;
  /**
   * Content rendered at the select's leading edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   * Clicking anywhere in the wrapper (other than an actionable adorn) opens the select, since the
   * native element itself no longer fills the wrapper's full width.
   */
  adornStart?: ReactNode;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * A description for the field, rendered below the select.
   */
  help?: ReactNode;
  /**
   * Specifies the number of visible options in a drop-down list.
   */
  htmlSize?: number;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the select when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with this select.
   */
  label?: ReactNode;
  /**
   * Allows more than one option to be selected at once. Pass `value` as a string array (or set
   * `selected` on more than one `options` entry) to control the selection.
   */
  multiple?: boolean;
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  /**
   * Options list of the select component. Available keys: `label`, `value`, `disabled`,
   * `selected`.
   * Examples:
   * - `options={[{ value: 'js', label: 'JavaScript' }, { value: 'html', label: 'HTML', disabled: true }]}`
   * - `options={['js', 'html']}`
   */
  options?: SelectOptionDef[] | string[];
  /**
   * Renders a disabled placeholder option as the first item (e.g. `"Select a country…"`).
   * The option has an empty value so it is not selectable once another option is chosen.
   */
  placeholder?: string;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the select when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: number | string | string[];
}
declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;
//#endregion
//#region src/components/switch/Switch.d.ts
interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'defaultChecked' | 'onChange' | 'size'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the switch indicator to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Whether the switch is selected, uncontrolled.
   */
  defaultSelected?: boolean;
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * Whether the switch is selected, controlled.
   */
  isSelected?: boolean;
  /**
   * The element represents a caption for a component.
   */
  label?: ReactNode;
  /**
   * Callback fired when the selected state changes.
   */
  onChange?: (isSelected: boolean) => void;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Specifies the type of component.
   */
  type?: 'checkbox' | 'radio';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
}
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/text-input/TextInput.d.ts
interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'onChange' | 'size' | 'value'> {
  /**
   * Content rendered at the input's trailing edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   */
  adornEnd?: ReactNode;
  /**
   * Content rendered at the input's leading edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   */
  adornStart?: ReactNode;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The value of the input, uncontrolled.
   */
  defaultValue?: string;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the input.
   */
  help?: ReactNode;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the input when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with this input.
   */
  label?: ReactNode;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: string) => void;
  /**
   * Render the component styled as plain text. Removes the default form field styling and preserve the correct margin and padding. Recommend to use only along side `readonly` [docs]
   */
  plainText?: boolean;
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Specifies the type of component. For `color` or `file` inputs, use the dedicated `ColorInput` or `FileInput` components instead.
   */
  type?: 'date' | 'datetime-local' | 'email' | 'month' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week' | (string & {});
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the input when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The value of the input, controlled.
   */
  value?: string;
}
declare const TextInput: React.ForwardRefExoticComponent<TextInputProps & React.RefAttributes<HTMLInputElement>>;
//#endregion
//#region src/components/textarea/Textarea.d.ts
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'defaultValue' | 'onChange' | 'value'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * The value of the textarea, uncontrolled.
   */
  defaultValue?: string;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * A description for the field, rendered below the textarea.
   */
  help?: ReactNode;
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean;
  /**
   * An error message for the field, rendered below the textarea when `invalid` is set.
   */
  invalidFeedback?: ReactNode;
  /**
   * The field's caption, rendered as a `FormLabel` associated with this textarea.
   */
  label?: ReactNode;
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: string) => void;
  /**
   * Render the component styled as plain text. Removes the default form field styling and preserve the correct margin and padding. Recommend to use only along side `readonly`.
   */
  plainText?: boolean;
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean;
  /**
   * The number of visible text lines for the control.
   */
  rows?: number;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Set component validation state to valid.
   */
  valid?: boolean;
  /**
   * A success message for the field, rendered below the textarea when `valid` is set.
   */
  validFeedback?: ReactNode;
  /**
   * The value of the textarea, controlled.
   */
  value?: string;
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
//#endregion
//#region src/components/placeholder/Placeholder.d.ts
type PlaceholderAlign = 'center' | 'end' | 'start';
type PlaceholderOwnProps<C extends ElementType> = {
  /**
   * Set the horizontal alignment. Only applies when `src` is set.
   */
  align?: PlaceholderAlign;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the generated placeholder graphic to one of Chassis context colors. Has no
   * effect when `src` is set.
   */
  color?: ContextColor;
  /**
   * Sets the variant of the generated placeholder graphic to one of Chassis context styles. Has no
   * effect when `src` is set.
   */
  variant?: Exclude<ContextStyle, 'basic' | 'outline'>;
  /**
   * Component used for the root node when `src` is set. Either a string to use an HTML element
   * or a component — e.g. a framework's own `Image` component. Its own props (`src`, `fill`,
   * `priority`, etc.) are type-checked at the call site once passed here.
   */
  component?: C;
  /**
   * Make the image responsive, so it never grows larger than its parent. Only applies when `src`
   * is set.
   */
  fluid?: boolean;
  /**
   * Placeholder height.
   */
  height?: number | string;
  /**
   * Give the image a rounded border-radius. Only applies when `src` is set.
   */
  rounded?: boolean;
  /**
   * Renders a real image instead of the generated placeholder graphic, e.g. a default asset or a
   * `placehold.co` URL.
   */
  src?: string;
  /**
   * Text shown in the generated placeholder graphic. Defaults to `{width}x{height}`. Pass `false`
   * to hide it. Has no effect when `src` is set.
   */
  text?: false | string;
  /**
   * Give the image a thumbnail appearance (padding, background, border, box-shadow). Only
   * applies when `src` is set.
   */
  thumbnail?: boolean;
  /**
   * Accessible title for the generated placeholder graphic, rendered as an SVG `<title>`. Pass
   * `false` to hide it. Has no effect when `src` is set.
   *
   * @default 'Placeholder'
   */
  title?: false | string;
  /**
   * Placeholder width.
   */
  width?: number | string;
};
type PlaceholderProps<C extends ElementType = 'img'> = PolymorphicComponentProps<C, PlaceholderOwnProps<C>>;
type PlaceholderComponent = (<C extends ElementType = 'img'>(props: PlaceholderProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Placeholder: PlaceholderComponent;
//#endregion
//#region src/components/list/List.d.ts
interface ListItemDef {
  /**
   * Stable key for the rendered item. Falls back to the item's index in `items`.
   */
  id?: number | string;
  /**
   * Item label content.
   */
  label: React.ReactNode;
  /**
   * Makes the item a link.
   */
  href?: string;
  /**
   * Sets the color of the item.
   */
  color?: ContextColor;
  /**
   * Marks the item as active.
   */
  active?: boolean;
  /**
   * Marks the item as disabled.
   */
  disabled?: boolean;
}
type ListOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `'ul'`, unless an item (a data-driven item with `href`, or a `<ListItem
   * component="a">`/`<ListItem component="button">` child) is interactive — a bare `<a>`/
   * `<button>` isn't a valid direct child of `<ul>`/`<ol>`, so the default switches to `'div'`
   * instead. Pass `component` explicitly to opt out of this.
   */
  component?: C;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Remove outer borders and rounded corners to render list items edge-to-edge in a parent component (e.g., `<Card>`).
   */
  flush?: boolean;
  /**
   * Array of item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: ListItemDef[];
  /**
   * Specify a layout type.
   */
  layout?: '2xlarge:horizontal' | 'horizontal' | 'large:horizontal' | 'medium:horizontal' | 'small:horizontal' | 'xlarge:horizontal';
  /**
   * Number list items sequentially using CSS counters. Pair with `component="ol"` for semantic correctness.
   */
  numbered?: boolean;
  /**
   * Remove outer borders, rounded corners, and horizontal padding for a minimal, edge-to-edge appearance.
   */
  plain?: boolean;
  /**
   * Applies a `.solid`, `.outline`, or `.smooth` context style. Only meaningful together with `color`.
   */
  variant?: ContextStyle;
};
type ListProps<C extends ElementType = 'ul'> = PolymorphicComponentProps<C, ListOwnProps<C>>;
type ListComponent = (<C extends ElementType = 'ul'>(props: ListProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const List: ListComponent;
//#endregion
//#region src/components/list/ListItem.d.ts
type ListItemOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * The href attribute specifies the URL of the page the link goes to. Only applicable when
   * `component` is `"a"`.
   */
  href?: string;
};
type ListItemProps<C extends ElementType = 'li'> = PolymorphicComponentProps<C, ListItemOwnProps<C>>;
type ListItemComponent = (<C extends ElementType = 'li'>(props: ListItemProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ListItem: ListItemComponent;
//#endregion
//#region src/components/modal/Modal.d.ts
interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'onCancel' | 'onClose'> {
  /**
   * Show a backdrop while the modal is open. `'static'` blocks closing on backdrop click
   * (the modal bounces instead). `false` is intentionally not equivalent to `modal={false}` —
   * unlike `Drawer`, whose vanilla chassis-css counterpart derives modality from `backdrop`,
   * chassis-css's vanilla `Dialog` only ever reads `backdrop` to distinguish `'static'` from
   * everything else; `modal` alone decides `showModal()`/`show()`. This mirrors that faithfully
   * rather than reintroducing an inconsistency with the vendored behavior.
   */
  backdrop?: 'static' | boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Set modal to cover the entire user viewport. A breakpoint value goes fullscreen only
   * below that breakpoint.
   */
  fullscreen?: '2xlarge' | 'large' | 'medium' | 'small' | 'xlarge' | boolean;
  /**
   * Disable the open/close transition entirely.
   */
  instant?: boolean;
  /**
   * Closes the modal when the escape key is pressed.
   */
  keyboard?: boolean;
  /**
   * Open with `showModal()` (top-layer, native backdrop). Set `false` to open with `show()`
   * instead — no backdrop, and the page behind the modal stays interactive.
   */
  modal?: boolean;
  /**
   * Callback fired when the modal requests to be closed (escape, backdrop click, or close button).
   */
  onClose?: () => void;
  /**
   * Callback fired when a close attempt is blocked (static backdrop click, or escape with `keyboard=false`).
   */
  onClosePrevented?: () => void;
  /**
   * Callback fired after the exit transition completes and the modal is fully hidden.
   */
  onHidden?: () => void;
  /**
   * Callback fired when the modal starts to open.
   */
  onShow?: () => void;
  /**
   * Callback fired after the entry transition completes and the modal is fully visible.
   */
  onShown?: () => void;
  /**
   * Create a scrollable modal — the header and footer stay fixed while the body scrolls.
   */
  scrollable?: boolean;
  /**
   * Size the component small, large, or extra large.
   */
  size?: 'large' | 'small' | 'xlarge';
  /**
   * Toggle the visibility of modal component.
   */
  visible?: boolean;
}
interface ModalContextProps {
  /**
   * Requests the modal be closed — fires `onClose`. Wire this to any element's `onClick`; see
   * `useModal`.
   */
  close: () => void;
  /**
   * Id generated by `Modal` and applied automatically by `ModalTitle` to itself, so the
   * dialog's `aria-labelledby` resolves to it without any manual wiring.
   */
  titleId?: string;
}
declare const Modal: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDialogElement>>;
//#endregion
//#region src/components/modal/ModalBody.d.ts
type ModalBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type ModalBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ModalBodyOwnProps<C>>;
type ModalBodyComponent = (<C extends ElementType = 'div'>(props: ModalBodyProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ModalBody: ModalBodyComponent;
//#endregion
//#region src/components/modal/ModalFooter.d.ts
type ModalFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Stack the footer actions as full-width columns instead of a right-aligned row.
   */
  stacked?: boolean;
};
type ModalFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ModalFooterOwnProps<C>>;
type ModalFooterComponent = (<C extends ElementType = 'div'>(props: ModalFooterProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ModalFooter: ModalFooterComponent;
//#endregion
//#region src/components/modal/ModalHeader.d.ts
type ModalHeaderOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean;
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type ModalHeaderProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ModalHeaderOwnProps<C>>;
type ModalHeaderComponent = (<C extends ElementType = 'div'>(props: ModalHeaderProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ModalHeader: ModalHeaderComponent;
//#endregion
//#region src/components/modal/ModalTitle.d.ts
type ModalTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type ModalTitleProps<C extends ElementType = 'h2'> = PolymorphicComponentProps<C, ModalTitleOwnProps<C>>;
type ModalTitleComponent = (<C extends ElementType = 'h2'>(props: ModalTitleProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ModalTitle: ModalTitleComponent;
//#endregion
//#region src/components/nav/Nav.d.ts
interface NavItemDef {
  /**
   * Label content for the nav item.
   */
  label: React.ReactNode;
  /**
   * URL for the nav link.
   */
  href?: string;
  /**
   * Marks the item as active.
   */
  active?: boolean;
  /**
   * Marks the item as disabled.
   */
  disabled?: boolean;
}
type NavOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Array of nav item definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: NavItemDef[];
  /**
   * Specify a layout type for component.
   */
  layout?: 'fill' | 'justified';
  /**
   * Set the nav variant to tabs or pills.
   */
  variant?: 'pills' | 'tabs';
};
type NavProps<C extends ElementType = 'ul'> = PolymorphicComponentProps<C, NavOwnProps<C>>;
type NavComponent = (<C extends ElementType = 'ul'>(props: NavProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Nav: NavComponent;
//#endregion
//#region src/components/nav/NavLink.d.ts
type NavLinkOwnProps = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
};
type NavLinkProps<C extends ElementType = 'a'> = LinkProps<C> & NavLinkOwnProps;
type NavLinkComponent = (<C extends ElementType = 'a'>(props: NavLinkProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const NavLink: NavLinkComponent;
//#endregion
//#region src/components/nav/NavItem.d.ts
type NavItemComponent = (<C extends ElementType = 'a'>(props: NavLinkProps<C> & {
  ref?: Ref<HTMLLIElement>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const NavItem: NavItemComponent;
//#endregion
//#region src/components/nav/NavTitle.d.ts
interface NavTitleProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
}
declare const NavTitle: React.ForwardRefExoticComponent<NavTitleProps & React.RefAttributes<HTMLLIElement>>;
//#endregion
//#region src/components/navbar/Navbar.d.ts
type NavbarOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Defines optional container wrapping children elements.
   */
  container?: '2xlarge' | 'fluid' | 'large' | 'medium' | 'small' | 'xlarge' | boolean;
  /**
   * Opts this navbar into the framework's dark or light theming, independent of the page's own
   * theme.
   */
  'data-cx-theme'?: 'dark' | 'light';
  /**
   * Renders inline at and above this breakpoint, as a drawer below it. `true` renders inline at
   * every width; omit to keep the drawer at every width.
   */
  expand?: Breakpoint | boolean;
  /**
   * Place component in non-static positions.
   */
  placement?: 'fixed-bottom' | 'fixed-top' | 'sticky-bottom' | 'sticky-top';
  /**
   * Blurs and saturates whatever sits behind the navbar — useful when it's positioned over a
   * hero image, video, or scrollable content.
   */
  translucent?: boolean;
  /**
   * Sets the context style of the component. `basic` (the default) renders with no extra class.
   */
  variant?: ContextStyle;
};
type NavbarProps<C extends ElementType = 'nav'> = PolymorphicComponentProps<C, NavbarOwnProps<C>>;
type NavbarComponent = (<C extends ElementType = 'nav'>(props: NavbarProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Navbar: NavbarComponent;
//#endregion
//#region src/components/navbar/NavbarBrand.d.ts
type NavbarBrandOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `span`, or `a` when `href` is set.
   */
  component?: C;
  /**
   * The href attribute specifies the URL of the page the link goes to. Defaults `component` to
   * `a`.
   */
  href?: string;
};
type NavbarBrandProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, NavbarBrandOwnProps<C>>;
type NavbarBrandComponent = (<C extends ElementType = 'span'>(props: NavbarBrandProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const NavbarBrand: NavbarBrandComponent;
//#endregion
//#region src/components/navbar/NavbarNav.d.ts
type NavbarNavOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type NavbarNavProps<C extends ElementType = 'ul'> = PolymorphicComponentProps<C, NavbarNavOwnProps<C>>;
type NavbarNavComponent = (<C extends ElementType = 'ul'>(props: NavbarNavProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const NavbarNav: NavbarNavComponent;
//#endregion
//#region src/components/navbar/NavbarText.d.ts
type NavbarTextOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type NavbarTextProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, NavbarTextOwnProps<C>>;
type NavbarTextComponent = (<C extends ElementType = 'span'>(props: NavbarTextProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const NavbarText: NavbarTextComponent;
//#endregion
//#region src/components/navbar/NavbarToggler.d.ts
interface NavbarTogglerProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * The accessible label announced by assistive technology when no children are provided.
   */
  label?: string;
}
declare const NavbarToggler: React.ForwardRefExoticComponent<NavbarTogglerProps & React.RefAttributes<HTMLButtonElement>>;
//#endregion
//#region src/components/pagination/Pagination.d.ts
interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /**
   * Current active page (1-indexed). Used with `pages` for data-driven mode.
   */
  activePage?: number;
  /**
   * Set the alignment of pagination components.
   */
  align?: 'center' | 'end' | 'start';
  /**
   * Accessible label for the pagination `<nav>` landmark. Override for non-English locales,
   * or when multiple paginators appear on the same page.
   *
   * @default 'Pagination'
   */
  'aria-label'?: string;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Maximum number of visible page buttons (default: 5). Flanking pages are collapsed to ellipsis.
   */
  maxVisiblePages?: number;
  /**
   * Accessible label for the "next page" control, used in smart pagination mode. Override for
   * non-English locales.
   *
   * @default 'Next'
   */
  nextLabel?: string;
  /**
   * Callback fired when the active page changes.
   */
  onActivePageChange?: (page: number) => void;
  /**
   * Total number of pages. When provided alongside `activePage` and `onActivePageChange`,
   * the component renders a fully-controlled smart paginator with Prev/Next and ellipsis.
   */
  pages?: number;
  /**
   * Accessible label for the "previous page" control, used in smart pagination mode. Override
   * for non-English locales.
   *
   * @default 'Previous'
   */
  previousLabel?: string;
  /**
   * Show the numbered page buttons in smart pagination mode. Set `false` alongside
   * `showPrevNext` to build a Prev/Next-only paginator.
   *
   * @default true
   */
  showPageNumbers?: boolean;
  /**
   * Show the Prev/Next controls in smart pagination mode. Set `false` alongside
   * `showPageNumbers` to build a page-numbers-only paginator.
   *
   * @default true
   */
  showPrevNext?: boolean;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
}
declare const Pagination: React.ForwardRefExoticComponent<PaginationProps & React.RefAttributes<HTMLElement>>;
//#endregion
//#region src/components/pagination/PaginationItem.d.ts
type PaginationItemOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean;
  /**
   * The href attribute. When provided the item renders as an `<a>` tag; otherwise as a `<button>`.
   */
  href?: string;
};
type PaginationItemProps<C extends ElementType = 'button'> = PolymorphicComponentProps<C, PaginationItemOwnProps<C>>;
type PaginationItemComponent = (<C extends ElementType = 'button'>(props: PaginationItemProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const PaginationItem: PaginationItemComponent;
//#endregion
//#region src/components/popover/Popover.d.ts
interface PopoverProps extends Pick<HTMLAttributes<HTMLDivElement>, 'aria-label' | 'aria-labelledby'> {
  children: ReactElement;
  /**
   * Content node for your component.
   */
  content: ReactNode | string;
  /**
   * Offset of the popover relative to its target, as `[crossAxis, mainAxis]`.
   */
  offset?: [number, number];
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void;
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void;
  /**
   * Title node for your component.
   */
  title?: ReactNode | string;
  /**
   * Describes the preferred placement of your component. Chassis will flip it to keep it in
   * view.
   */
  placement?: Placement;
  /**
   * Toggle the visibility of popover component.
   */
  visible?: boolean;
}
declare const Popover: FC<PopoverProps>;
//#endregion
//#region src/components/progress/Progress.d.ts
type ProgressOwnProps<C extends ElementType> = {
  /**
   * Use to animate the stripes right to left via CSS3 animations.
   */
  animated?: boolean;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Sets the height of the component, via the `--cx-height` custom property. If you set that
   * value the inner bar (and the striped pattern's tile size) automatically resizes accordingly.
   */
  height?: number;
  /**
   * Shows the current value as text inside the bar, independently of `showValue` — combine both
   * to get a `label` + `showValue` caption above the bar alongside an `inlineValue` reading
   * inside it.
   */
  inlineValue?: boolean;
  /**
   * A text label describing the progress. Rendered in a caption row above the bar. Also used as
   * the default accessible name when no `aria-label`/`aria-labelledby` is supplied.
   */
  label?: ReactNode;
  /**
   * Shows the current value as text in the caption row above the bar, alongside `label` when
   * both are set, or alone otherwise. Use `inlineValue` to show it inside the bar instead.
   */
  showValue?: boolean;
  /**
   * Adds a diagonal stripe pattern over the bar's background.
   */
  striped?: boolean;
  /**
   * The percent to progress the ProgressBar (out of 100).
   */
  value?: number;
};
type ProgressProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ProgressOwnProps<C>>;
type ProgressComponent = (<C extends ElementType = 'div'>(props: ProgressProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Progress: ProgressComponent;
//#endregion
//#region src/components/progress/ProgressBar.d.ts
type ProgressBarOwnProps<C extends ElementType> = {
  /**
   * Use to animate the stripes right to left via CSS3 animations.
   */
  animated?: boolean;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Adds a diagonal stripe pattern over the bar's background.
   */
  striped?: boolean;
  /**
   * The percent to progress the ProgressBar.
   */
  value?: number;
};
type ProgressBarProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ProgressBarOwnProps<C>>;
type ProgressBarComponent = (<C extends ElementType = 'div'>(props: ProgressBarProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ProgressBar: ProgressBarComponent;
//#endregion
//#region src/components/drawer/Drawer.d.ts
interface DrawerProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'onCancel' | 'onClose'> {
  /**
   * Show a backdrop while the drawer is open. `'static'` blocks closing on backdrop click
   * (the drawer nudges instead).
   */
  backdrop?: 'static' | boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Size the height to the drawer's content instead of `--drawer-height`. Meaningful for
   * `placement="bottom"`.
   */
  fitContent?: boolean;
  /**
   * Expand the panel to fill the viewport, animating in from the direction of `placement`.
   */
  fullscreen?: boolean;
  /**
   * Disable the open/close transition entirely.
   */
  instant?: boolean;
  /**
   * Closes the drawer when the escape key is pressed.
   */
  keyboard?: boolean;
  /**
   * Callback fired when the drawer requests to be closed (escape, backdrop click, close button,
   * or another drawer opening).
   */
  onClose?: () => void;
  /**
   * Callback fired when a close attempt is blocked (static backdrop click, or escape with `keyboard=false`).
   */
  onClosePrevented?: () => void;
  /**
   * Callback fired after the exit transition completes and the drawer is fully hidden.
   */
  onHidden?: () => void;
  /**
   * Callback fired when the drawer starts to open.
   */
  onShow?: () => void;
  /**
   * Callback fired after the entry transition completes and the drawer is fully visible.
   */
  onShown?: () => void;
  /**
   * Which viewport edge the panel slides in from. Always required — there is no default
   * off-screen transform without one.
   */
  placement: 'bottom' | 'end' | 'start' | 'top';
  /**
   * Renders as a drawer only below this breakpoint — inline as a flex container above it.
   */
  responsive?: '2xlarge' | 'large' | 'medium' | 'small' | 'xlarge';
  /**
   * Allow the page behind the drawer to scroll while it's open.
   */
  scroll?: boolean;
  /**
   * Remove the inset gap, border radius, and border so the panel sits flush against the
   * viewport edge.
   */
  sheet?: boolean;
  /**
   * Apply a frosted-glass background to the panel.
   */
  translucent?: boolean;
  /**
   * Toggle the visibility of the drawer component.
   */
  visible?: boolean;
}
interface DrawerContextProps {
  /**
   * Requests the drawer be closed — fires `onClose`. Wire this to any element's `onClick`; see
   * `useDrawer`.
   */
  close: () => void;
  /**
   * Id generated by `Drawer` and applied automatically by `DrawerTitle` to itself, so the
   * dialog's `aria-labelledby` resolves to it without any manual wiring.
   */
  titleId?: string;
}
declare const Drawer: React.ForwardRefExoticComponent<DrawerProps & React.RefAttributes<HTMLDialogElement>>;
//#endregion
//#region src/components/drawer/DrawerBody.d.ts
type DrawerBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type DrawerBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, DrawerBodyOwnProps<C>>;
type DrawerBodyComponent = (<C extends ElementType = 'div'>(props: DrawerBodyProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const DrawerBody: DrawerBodyComponent;
//#endregion
//#region src/components/drawer/DrawerFooter.d.ts
type DrawerFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Stack the footer actions as full-width columns instead of a right-aligned row.
   */
  stacked?: boolean;
};
type DrawerFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, DrawerFooterOwnProps<C>>;
type DrawerFooterComponent = (<C extends ElementType = 'div'>(props: DrawerFooterProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const DrawerFooter: DrawerFooterComponent;
//#endregion
//#region src/components/drawer/DrawerHeader.d.ts
type DrawerHeaderOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Add a close button component to the header.
   */
  closeButton?: boolean;
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type DrawerHeaderProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, DrawerHeaderOwnProps<C>>;
type DrawerHeaderComponent = (<C extends ElementType = 'div'>(props: DrawerHeaderProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const DrawerHeader: DrawerHeaderComponent;
//#endregion
//#region src/components/drawer/DrawerTitle.d.ts
type DrawerTitleOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type DrawerTitleProps<C extends ElementType = 'h2'> = PolymorphicComponentProps<C, DrawerTitleOwnProps<C>>;
type DrawerTitleComponent = (<C extends ElementType = 'h2'>(props: DrawerTitleProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const DrawerTitle: DrawerTitleComponent;
//#endregion
//#region src/components/skeleton/Skeleton.d.ts
type SkeletonOwnProps<C extends ElementType> = {
  /**
   * Adds `skeleton-{animation}` alongside the base `skeleton` class, so the element animates
   * itself as well as any nested `<Skeleton>` children. Nest plain `<Skeleton>` children inside
   * it for the glow pulse to reach them too, or apply `wave` to a container of one or more
   * `<Skeleton>` children for a directional sweep across the whole group.
   */
  animation?: 'glow' | 'wave';
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use an HTML element or a component —
   * e.g. `Avatar` or `Button`. Its own props are type-checked at the call site once passed here.
   *
   * @default 'span'
   */
  component?: C;
  /**
   * Width of the skeleton, expressed as a column span (of 12), or `'auto'`/`true` for a
   * natural-width skeleton. Unset by default, so the rendered element's own intrinsic width
   * applies — set it explicitly (e.g. `span={12}`) for a full-width text line; leave it unset
   * when `component` is something that sizes itself, like `Avatar` or `Button`.
   *
   * @type { 'auto' | number | string | boolean }
   */
  span?: Span;
  /**
   * Overrides `span` at a breakpoint and up.
   *
   * @type { Partial<Record<'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', 'auto' | number | string | boolean>> }
   */
  responsive?: Partial<Record<Breakpoint, Span>>;
};
type SkeletonProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, SkeletonOwnProps<C>>;
type SkeletonComponent = (<C extends ElementType = 'span'>(props: SkeletonProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Skeleton: SkeletonComponent;
//#endregion
//#region src/components/skeleton/SkeletonLoader.d.ts
type SkeletonLoaderOwnProps<C extends ElementType> = {
  /**
   * The real content, rendered unchanged (no wrapping element) once `loading` is `false`.
   */
  children: ReactNode;
  /**
   * Sets the color of the generated skeleton lines to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the generated skeleton(s) — e.g. `Avatar` or `Button` — for swapping
   * non-text content, not just text runs. Its own props are type-checked at the call site once
   * passed here, same as `Skeleton`'s own `component` prop.
   *
   * @default 'span'
   */
  component?: C;
  /**
   * Swaps `children` for one `<Skeleton>` per entry in `spans` while `true`.
   */
  loading: boolean;
  /**
   * One skeleton line per entry, using the same values as `Skeleton`'s `span` prop — e.g.
   * `[12, 6]` for a full-width line followed by a half-width one. A single value (e.g. `6`) is
   * shorthand for a single line, equivalent to `[6]`. Leave unset for a single skeleton sized by
   * `component`'s own intrinsic width instead — e.g. an `Avatar`'s `size` prop. Rendered instead
   * of `children` while `loading` is `true`; ignored once `loading` is `false`.
   *
   * @type { 'auto' | number | string | boolean | Array<'auto' | number | string | boolean> }
   */
  spans?: Span | Span[];
};
type SkeletonLoaderProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, SkeletonLoaderOwnProps<C>>;
type SkeletonLoaderComponent = (<C extends ElementType = 'span'>(props: SkeletonLoaderProps<C>) => ReactElement | null) & {
  displayName?: string;
};
declare const SkeletonLoader: SkeletonLoaderComponent;
//#endregion
//#region src/components/spinner/Spinner.d.ts
type SpinnerOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Size the component small.
   */
  size?: 'small';
  /**
   * Set the button variant to an outlined button or a ghost button.
   */
  variant?: 'border' | 'grow';
  /**
   * Set visually hidden label for accessibility purposes.
   */
  visuallyHiddenLabel?: string;
};
type SpinnerProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, SpinnerOwnProps<C>>;
type SpinnerComponent = (<C extends ElementType = 'div'>(props: SpinnerProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Spinner: SpinnerComponent;
//#endregion
//#region src/components/stepper/Stepper.d.ts
interface StepperItemDef {
  /**
   * Step label content.
   */
  label: React.ReactNode;
  /**
   * Marks the item as the current step.
   */
  active?: boolean;
  /**
   * Sets the color of the item.
   */
  color?: ContextColor;
  /**
   * Renders the item as a link to the given URL.
   */
  href?: string;
}
type StepperOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `'ol'`, unless a step (a data-driven item with `href`, or a `<StepperItem
   * component="a">`/`<StepperItem component="button">` child) is interactive — a bare `<a>`/
   * `<button>` isn't a valid direct child of `<ol>`, so the default switches to `'div'` instead.
   * Pass `component` explicitly to opt out of this.
   */
  component?: C;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Replaces the step counters with icons, driven by the `--status-icon` custom property.
   */
  icon?: boolean;
  /**
   * Array of step definitions for data-driven rendering. When provided, children are ignored.
   */
  items?: StepperItemDef[];
  /**
   * Lays out steps side-by-side instead of stacking them vertically, either unconditionally or
   * from a given breakpoint up.
   */
  layout?: '2xlarge:horizontal' | 'horizontal' | 'large:horizontal' | 'medium:horizontal' | 'small:horizontal' | 'xlarge:horizontal';
  /**
   * Wraps the stepper in a horizontally scrollable container so steps keep their natural width
   * instead of shrinking to fit.
   */
  overflow?: boolean;
};
type StepperProps<C extends ElementType = 'ol'> = PolymorphicComponentProps<C, StepperOwnProps<C>>;
type StepperComponent = (<C extends ElementType = 'ol'>(props: StepperProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Stepper: StepperComponent;
//#endregion
//#region src/components/stepper/StepperItem.d.ts
type StepperItemOwnProps<C extends ElementType> = {
  /**
   * Marks the item as the current step.
   */
  active?: boolean;
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * The `href` attribute for an interactive step rendered as a link.
   */
  href?: string;
};
type StepperItemProps<C extends ElementType = 'li'> = PolymorphicComponentProps<C, StepperItemOwnProps<C>>;
type StepperItemComponent = (<C extends ElementType = 'li'>(props: StepperItemProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const StepperItem: StepperItemComponent;
//#endregion
//#region src/components/table/Table.d.ts
interface TableProps<T extends object> {
  /**
   * An accessible label for the table, used when there's no visible heading.
   */
  'aria-label'?: string;
  /**
   * Identifies a visible heading element for the table.
   */
  'aria-labelledby'?: string;
  /**
   * Set the vertical alignment of cell content.
   */
  align?: 'bottom' | 'middle' | 'top';
  /**
   * Add borders on all sides of the table and cells.
   */
  bordered?: boolean;
  /**
   * Remove borders on all sides of the table and cells.
   */
  borderless?: boolean;
  /**
   * Content shown above the table, functioning as a heading for it.
   */
  caption?: ReactNode;
  /**
   * A `TableHeader` and a `TableBody`, each built from `TableColumn`/`TableRow`/
   * `TableCell` — read as data to build the table's collection. Not rendered directly.
   */
  children: [ReactElement<TableHeaderProps<T> & {
    className?: string;
  }>, ReactElement<TableBodyProps<T> & {
    className?: string;
  }>];
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component.
   */
  color?: ContextColor;
  /**
   * A list of row keys to disable. Disabled rows cannot be selected, focused, or interacted with.
   */
  disabledKeys?: Iterable<Key$1>;
  /**
   * Content shown below the table in a `<tfoot>`, e.g. a totals row. Rendered as plain markup —
   * not part of the keyboard-navigable grid.
   */
  footer?: ReactNode;
  /**
   * Enable a hover state on table rows.
   */
  hover?: boolean;
  /**
   * `id` forwarded to the table element.
   */
  id?: string;
  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Selection) => void;
  /**
   * Handler that is called when a column is sorted.
   */
  onSortChange?: (descriptor: SortDescriptor) => void;
  /**
   * Make any table responsive across all viewports or pick a maximum breakpoint.
   */
  responsive?: '2xlarge' | 'large' | 'medium' | 'small' | 'xlarge' | boolean;
  /**
   * The currently selected row keys (controlled).
   */
  selectedKeys?: Selection;
  /**
   * The type of selection that is allowed.
   */
  selectionMode?: 'multiple' | 'none' | 'single';
  /**
   * Make table more compact by cutting all cell padding.
   */
  small?: boolean;
  /**
   * The current sort column and direction.
   */
  sortDescriptor?: SortDescriptor;
  /**
   * Convert rows into stacked label/value blocks below a container width, for tables with too
   * many columns to read comfortably even with horizontal scrolling. `true` always stacks; a
   * breakpoint name stacks only below it. Implies `responsive` when `responsive` isn't set
   * separately, since stacking needs the same `.table-responsive` container-query ancestor.
   * Labels come from each `TableColumn`'s text (or its `textValue`, for non-text headers).
   */
  stacked?: '2xlarge' | 'large' | 'medium' | 'small' | 'xlarge' | boolean;
  /**
   * Add zebra-striping to table rows.
   */
  striped?: boolean;
}
declare const Table: <T extends object>(props: TableProps<T> & {
  ref?: Ref<HTMLTableElement>;
}) => ReactElement;
//#endregion
//#region src/components/table/TableBody.d.ts
interface TableBodyProps$1<T> {
  /**
   * `TableRow` elements, or a render function paired with `items` for dynamic row generation.
   */
  children: ((item: T) => ReactElement) | ReactElement | ReactElement[];
  /**
   * A string of all className you want applied to the `<tbody>` element.
   */
  className?: string;
  /**
   * A list of row data objects, rendered via the function form of `children`.
   */
  items?: Iterable<T>;
}
/**
 * Collection node, data-only — read by `Table` to build the table's row collection. Never
 * rendered directly.
 */
declare const TableBody: <T>(props: TableBodyProps$1<T>) => ReactElement;
//#endregion
//#region src/components/table/TableCell.d.ts
interface TableCellProps {
  /**
   * The contents of the cell.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the cell.
   */
  className?: string;
  /**
   * Indicates how many columns the cell spans.
   */
  colSpan?: number;
  /**
   * A string representation of the cell's contents, used for typeahead.
   */
  textValue?: string;
}
/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a cell in the
 * table's collection; never rendered directly.
 */
declare const TableCell: (props: TableCellProps) => ReactElement;
//#endregion
//#region src/components/table/TableColumn.d.ts
interface TableColumnProps {
  /**
   * Whether the column allows sorting. Adds a sort indicator and makes the header
   * clickable/keyboard-activatable.
   */
  allowsSorting?: boolean;
  /**
   * Rendered contents of the column header.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the column header.
   */
  className?: string;
  /**
   * A string representation of the column header, used for accessibility announcements and,
   * when `Table`'s `stacked` prop is set, as the label shown before each row's value for this
   * column. Defaults to `children` when it's a plain string — set this explicitly when the
   * header contains anything else (an icon, a `Tooltip`, etc.).
   */
  textValue?: string;
}
/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a column in the
 * table's collection; never rendered directly.
 */
declare const TableColumn: (props: TableColumnProps) => ReactElement;
//#endregion
//#region src/components/table/TableHeader.d.ts
interface TableHeaderProps$1<T> {
  /**
   * `TableColumn` elements, or a render function paired with `columns` for dynamic column
   * generation.
   */
  children: ((column: T) => ReactElement) | ReactElement | ReactElement[];
  /**
   * A string of all className you want applied to the `<thead>` element.
   */
  className?: string;
  /**
   * A list of column data objects, rendered via the function form of `children`.
   */
  columns?: readonly T[];
}
/**
 * Collection node, data-only — read by `Table` to build the table's column collection. Never
 * rendered directly.
 */
declare const TableHeader: <T>(props: TableHeaderProps$1<T>) => ReactElement;
//#endregion
//#region src/components/table/TableRow.d.ts
interface TableRowProps {
  /**
   * `TableCell` elements, or a render function called once per column with that column's key —
   * required when the row's parent `TableBody` uses the `items`/render-function form.
   */
  children: ((columnKey: Key) => ReactElement) | ReactElement | ReactElement[];
  /**
   * A string of all className you want applied to the row.
   */
  className?: string;
  /**
   * A string representation of the row's contents, used for typeahead.
   */
  textValue?: string;
}
/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a row in the
 * table's collection; never rendered directly.
 */
declare const TableRow: (props: TableRowProps) => ReactElement;
//#endregion
//#region src/components/tabs/Tabs.d.ts
type TabsOwnProps<C extends ElementType> = {
  /**
   * A `TabList` (containing `Tab` children) followed by one `TabPanel` per tab.
   */
  children?: ReactNode;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * The initially selected tab's key (uncontrolled).
   */
  defaultSelectedKey?: Key$2;
  /**
   * The keys of tabs that cannot be selected, focused, or otherwise interacted with.
   */
  disabledKeys?: Iterable<Key$2>;
  /**
   * Whether tabs are selected automatically on arrow-key focus (`'automatic'`, the default) or
   * only on explicit activation — Enter/Space or click (`'manual'`).
   */
  keyboardActivation?: 'automatic' | 'manual';
  /**
   * Callback fired when the selected tab changes.
   */
  onSelectionChange?: (key: Key$2) => void;
  /**
   * The orientation of the tab list.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The selected tab's key (controlled).
   */
  selectedKey?: Key$2;
};
type TabsProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, TabsOwnProps<C>>;
type TabsComponent = (<C extends ElementType = 'div'>(props: TabsProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Tabs: TabsComponent;
//#endregion
//#region src/components/tabs/Tab.d.ts
interface TabProps {
  /**
   * Label content for the tab. Must be a plain string for it to be used as the tab's accessible
   * name when the rendered content itself doesn't expose one (e.g. an icon-only tab).
   */
  children: ReactNode;
  /**
   * Prevents the tab from being selected, focused, or otherwise interacted with.
   */
  disabled?: boolean;
  /**
   * Identifies this tab and pairs it with the `TabPanel` of the same `id`.
   */
  id: Key$2;
}
declare const Tab: {
  (_props: TabProps): null;
  displayName: string;
};
//#endregion
//#region src/components/tabs/TabList.d.ts
interface TabListProps extends AriaAttributes {
  /**
   * `Tab` elements — read as data by `Tabs` to build the tab collection (see `Tabs.tsx`). Not
   * rendered directly.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Set the tab list variant to tabs or pills.
   */
  variant?: 'pills' | 'tabs';
}
declare const TabList: React.ForwardRefExoticComponent<TabListProps & React.RefAttributes<HTMLUListElement>>;
//#endregion
//#region src/components/tabs/TabPanel.d.ts
interface TabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /**
   * Content of the panel, shown while the `Tab` of the same `id` is selected.
   */
  children: ReactNode;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Pairs this panel with the `Tab` of the same `id`.
   */
  id: Key$2;
}
declare const TabPanel: React.ForwardRefExoticComponent<TabPanelProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/toast/Toast.d.ts
interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Apply a CSS fade transition to the toast.
   */
  animation?: boolean;
  /**
   * Auto hide the toast. The timer starts once the show transition completes and pauses
   * while the pointer is over the toast or focus is within it.
   */
  autohide?: boolean;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Adds a close button — shorthand for `ToastHeader`'s/`ToastBody`'s `closeButton` prop.
   * Placed in the header when `icon`/`title`/`time` is set; otherwise placed in the body
   * alongside `message`, or in a header containing only the close button if `message` is
   * also unset.
   */
  closeButton?: boolean;
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs. Shorthand for `ToastHeader`'s `closeLabel` prop.
   */
  closeLabel?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Delay hiding the toast (ms).
   */
  delay?: number;
  /**
   * Trailing content — typically a row of `Button`s — rendered via a single `ToastFooter`,
   * after `message`/`children`. Pass a function to receive `close` directly, instead of
   * calling `useToast()` from a child component to wire up a "Close" action.
   */
  footer?: ((close: () => void) => ReactNode) | ReactNode;
  /**
   * Leading icon for the header. A string is rendered as `<ToastIcon name={icon} />`; pass
   * any other node for a fully custom icon (typically a logo or avatar). Shorthand for
   * `ToastHeader`'s `icon` prop; hidden from assistive technology by default, since it
   * duplicates `title` visually.
   */
  icon?: ReactNode | string;
  /**
   * Message body, rendered via a single `ToastBody`. For multi-block content, compose
   * `children` manually instead — `message` wraps everything in one element.
   */
  message?: ReactNode;
  /**
   * Header timestamp, rendered after `title`. Shorthand for `ToastHeader`'s `time` prop.
   */
  time?: ReactNode;
  /**
   * Header heading, rendered before `time`. Shorthand for `ToastHeader`'s children. When set
   * alongside `message`, wires the toast's `aria-labelledby`/`aria-describedby` to them
   * automatically.
   */
  title?: ReactNode;
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: () => void;
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void;
  /**
   * ARIA live-region role. Use `status` (the default) for confirmation, progress, and
   * informational messages, which announce politely. Use `alert` for messages that need
   * immediate attention — validation errors, failed operations — which interrupt speech.
   */
  role?: 'alert' | 'status';
  /**
   * Apply a full-color background with inverted text. Only meaningful alongside `color`.
   */
  solid?: boolean;
  /**
   * Apply a semi-transparent background.
   */
  translucent?: boolean;
  /**
   * Toggle the visibility of component.
   */
  visible?: boolean;
}
declare const Toast: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/toast/ToastBody.d.ts
type ToastBodyOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Adds a close button alongside the body content, so a toast composed without a
   * `ToastHeader` still gets a dismiss control without any manual layout markup.
   */
  closeButton?: boolean;
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type ToastBodyProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ToastBodyOwnProps<C>>;
type ToastBodyComponent = (<C extends ElementType = 'div'>(props: ToastBodyProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ToastBody: ToastBodyComponent;
//#endregion
//#region src/components/toast/ToastFooter.d.ts
type ToastFooterOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
};
type ToastFooterProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ToastFooterOwnProps<C>>;
type ToastFooterComponent = (<C extends ElementType = 'div'>(props: ToastFooterProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ToastFooter: ToastFooterComponent;
//#endregion
//#region src/components/toast/ToastHeader.d.ts
type ToastHeaderOwnProps<C extends ElementType> = {
  /**
   * Heading, rendered before `time` as a `<strong>`.
   */
  children?: ReactNode;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Automatically add a close button to the header.
   */
  closeButton?: boolean;
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Leading icon. A string is rendered as `<ToastIcon name={icon} />` and hidden from
   * assistive technology by default, since it duplicates the heading visually. Pass any other
   * node for a fully custom icon (typically a logo or avatar) — a custom node is left as-is,
   * since it may carry its own meaningful accessible name (e.g. an avatar's `alt` text).
   */
  icon?: ReactNode | string;
  /**
   * Trailing timestamp, rendered after the heading.
   */
  time?: ReactNode;
  /**
   * Sets the `id` on the rendered heading element, for `aria-labelledby` wiring. Set
   * automatically by `Toast` when both `title` and `message` are used together; only needed
   * here for manual wiring in a fully custom composition.
   */
  titleId?: string;
};
type ToastHeaderProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, ToastHeaderOwnProps<C>>;
type ToastHeaderComponent = (<C extends ElementType = 'div'>(props: ToastHeaderProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const ToastHeader: ToastHeaderComponent;
//#endregion
//#region src/components/toast/ToastIcon.d.ts
type ToastIconProps = IconProps & {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
};
declare const ToastIcon: React.ForwardRefExoticComponent<ToastIconProps & React.RefAttributes<HTMLSpanElement | SVGSVGElement>>;
//#endregion
//#region src/components/toast/Toaster.d.ts
interface ToasterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Overrides the toast region's accessible name (defaults to `'Notifications'`, per
   * react-aria). Set this for non-English UIs, or to distinguish multiple toasters on the
   * same page.
   */
  'aria-label'?: string;
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string;
  /**
   * Describes the placement of your component.
   *
   * @type 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end' | string
   */
  placement?: 'bottom-center' | 'bottom-end' | 'bottom-start' | 'middle-center' | 'middle-end' | 'middle-start' | 'top-center' | 'top-end' | 'top-start' | string;
}
declare const Toaster: React.ForwardRefExoticComponent<ToasterProps & React.RefAttributes<HTMLDivElement>>;
//#endregion
//#region src/components/toast/toastQueue.d.ts
interface ToastContent {
  /**
   * Apply a CSS fade transition to the toast.
   */
  animation?: boolean;
  /**
   * Auto hide the toast. The timer starts once the show transition completes and pauses
   * while the pointer is over the toast or focus is within it.
   */
  autohide?: boolean;
  /**
   * Content of the toast — typically a `Toast.Header`/`Toast.Body`/`Toast.Footer`.
   */
  children: ReactNode;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Delay hiding the toast (ms).
   */
  delay?: number;
  /**
   * Apply a full-color background with inverted text. Only meaningful alongside `color`.
   */
  solid?: boolean;
  /**
   * Apply a semi-transparent background.
   */
  translucent?: boolean;
}
declare const toastQueue: ToastQueue<ToastContent>;
declare function addToast(children: ReactNode, options?: Omit<ToastContent, 'children'>): string;
declare function closeToast(key: string): void;
//#endregion
//#region src/components/tooltip/Tooltip.d.ts
interface TooltipProps {
  children: ReactElement;
  /**
   * Content node for your component.
   */
  content: ReactNode | string;
  /**
   * Offset of the tooltip relative to its target, as `[crossAxis, mainAxis]`.
   */
  offset?: [number, number];
  /**
   * Callback fired when the component requests to be hidden.
   */
  onHide?: () => void;
  /**
   * Callback fired when the component requests to be shown.
   */
  onShow?: () => void;
  /**
   * Describes the preferred placement of your component. Chassis will flip it to keep it in
   * view.
   */
  placement?: Placement;
  /**
   * Tooltips always show on focus, since keyboard/screen-reader users need them too. Set to
   * `'focus'` to disable the hover trigger and show on focus only.
   */
  trigger?: 'focus' | 'hover';
  /**
   * Toggle the visibility of the tooltip component.
   */
  visible?: boolean;
}
declare const Tooltip: FC<TooltipProps>;
//#endregion
//#region src/hooks/useDrawer.d.ts
type UseDrawerResult = DrawerContextProps;
declare const useDrawer: () => UseDrawerResult;
//#endregion
//#region src/hooks/useModal.d.ts
type UseModalResult = ModalContextProps;
declare const useModal: () => UseModalResult;
//#endregion
//#region src/components/notification/context.d.ts
interface NotificationContextProps {
  /**
   * Whether the notification is currently visible.
   */
  visible?: boolean;
  /**
   * Dismisses the notification. Wire this to any element's `onClick` — see `useNotification`.
   */
  close: () => void;
}
//#endregion
//#region src/hooks/useNotification.d.ts
type UseNotificationResult = NotificationContextProps;
declare const useNotification: () => UseNotificationResult;
//#endregion
//#region src/hooks/usePagination.d.ts
interface UsePaginationOptions {
  /**
   * Whether the Previous control is currently disabled.
   */
  prevDisabled: boolean;
  /**
   * Whether the Next control is currently disabled.
   */
  nextDisabled: boolean;
  /**
   * Called when Previous is clicked, before the state change that may disable it.
   */
  onPrev: () => void;
  /**
   * Called when Next is clicked, before the state change that may disable it.
   */
  onNext: () => void;
}
interface UsePaginationResult<T extends HTMLElement = HTMLButtonElement> {
  prevRef: RefObject<T>;
  nextRef: RefObject<T>;
  handlePrevClick: (event: MouseEvent<T>) => void;
  handleNextClick: (event: MouseEvent<T>) => void;
}
declare function usePagination<T extends HTMLElement = HTMLButtonElement>({ prevDisabled, nextDisabled, onPrev, onNext }: UsePaginationOptions): UsePaginationResult<T>;
//#endregion
//#region src/components/toast/context.d.ts
interface ToastContextProps {
  /**
   * Whether the toast is currently visible.
   */
  visible?: boolean;
  /**
   * Dismisses the toast. Wire this to any element's `onClick` — see `useToast`.
   */
  close: () => void;
}
//#endregion
//#region src/hooks/useToast.d.ts
type UseToastResult = ToastContextProps;
declare const useToast: () => UseToastResult;
//#endregion
//#region src/components/chip/Chip.d.ts
type ChipOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `span`, or `a` when `href` is set.
   */
  component?: C;
  /**
   * Toggle the disabled state for the component. Applied as the native `disabled` attribute when
   * `component` is `button`, or the `.disabled` class for every other element (a bare `<span>`/
   * `<a>` has no real `disabled` attribute).
   */
  disabled?: boolean;
  /**
   * Renders the chip as a link to this URL. Defaults `component` to `a`.
   */
  href?: string;
  /**
   * Fires on click. Typed for every element `component` can actually render, rather than
   * narrowed to whichever element `C` happens to be.
   */
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Marks the chip as pressed for toggle-style usage (e.g. a filter chip). Applies the `.active`
   * class and sets `aria-pressed` so assistive technology announces the toggle state.
   */
  pressed?: boolean;
  /**
   * Size the component small or large.
   */
  size?: 'large' | 'small';
  /**
   * Specifies the type of button. Only applies when `component` is `button`. Different browsers
   * may use different default types for the `<button>` element, so always specify it explicitly.
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * Set the chip style variant. `solid`/`basic` render the default look with no extra class.
   */
  variant?: ContextStyle;
};
type ChipProps<C extends ElementType = 'span'> = PolymorphicComponentProps<C, ChipOwnProps<C>>;
type ChipComponent = (<C extends ElementType = 'span'>(props: ChipProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Chip: ChipComponent;
//#endregion
//#region src/components/flex/Flex.d.ts
interface FlexLayout {
  /**
   * Sets `flex-direction`. Omit for the browser default (`row`).
   */
  direction?: 'column' | 'column-reverse' | 'row' | 'row-reverse';
  /**
   * Sets `flex-wrap`. Omit for the browser default (`nowrap`).
   */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /**
   * Sets `justify-content`, aligning items along the main axis.
   */
  justify?: 'around' | 'between' | 'center' | 'end' | 'evenly' | 'start';
  /**
   * Sets `align-items`, aligning items along the cross axis.
   */
  align?: 'baseline' | 'center' | 'end' | 'start' | 'stretch';
  /**
   * Sets `align-content`, distributing wrapped lines along the cross axis. Has no effect on
   * single-line (non-wrapping) containers.
   */
  alignContent?: 'around' | 'between' | 'center' | 'end' | 'start' | 'stretch';
  /**
   * Spacing between children on both axes, mapped to the `gap-*` utility classes. Overridden per
   * axis by `rowGap`/`columnGap` where set.
   */
  gap?: 0 | Spacing;
  /**
   * Spacing between rows (the cross axis when wrapped), mapped to the `row-gap-*` utility
   * classes. Independent of `gap`/`columnGap`.
   */
  rowGap?: 0 | Spacing;
  /**
   * Spacing between columns (the main axis), mapped to the `column-gap-*` utility classes.
   * Independent of `gap`/`rowGap`.
   */
  columnGap?: 0 | Spacing;
}
type FlexOwnProps<C extends ElementType> = FlexLayout & {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Renders an inline flex container (`.d-inline-flex`) instead of a block-level one (`.d-flex`,
   * the default).
   */
  inline?: boolean;
  /**
   * Overrides any of `direction`/`wrap`/`justify`/`align`/`alignContent`/`gap`/`rowGap`/
   * `columnGap` at one or more breakpoints, via regular viewport media queries (unlike `Stack`'s
   * `responsive` prop, this doesn't require a `.contains-inline` ancestor).
   */
  responsive?: Partial<Record<Breakpoint, FlexLayout>>;
};
type FlexProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, FlexOwnProps<C>>;
type FlexComponent = (<C extends ElementType = 'div'>(props: FlexProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Flex: FlexComponent;
//#endregion
//#region src/components/stack/Stack.d.ts
type StackOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string;
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C;
  /**
   * Lays children out in a row (`horizontal`, the default, maps to `.hstack`) or a column
   * (`vertical`, maps to `.vstack`).
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Spacing between children, mapped to the `gap-*` utility classes.
   */
  gap?: 0 | Spacing;
  /**
   * Switches `direction` at one or more breakpoints via container queries. Requires a
   * `.contains-inline` ancestor (not applied by `Stack` itself — see the docs) to establish the
   * container context these queries evaluate against.
   */
  responsive?: Partial<Record<Breakpoint, 'horizontal' | 'vertical'>>;
};
type StackProps<C extends ElementType = 'div'> = PolymorphicComponentProps<C, StackOwnProps<C>>;
type StackComponent = (<C extends ElementType = 'div'>(props: StackProps<C> & {
  ref?: PolymorphicRef<C>;
}) => ReactElement | null) & {
  displayName?: string;
};
declare const Stack: StackComponent;
//#endregion
export { Accordion, AccordionBody, AccordionHeader, AccordionItem, Autocomplete, AutocompleteGroup, AutocompleteItem, Avatar, AvatarImage, AvatarStack, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Calendar, Card, CardBody, CardFooter, CardGroup, CardHeader, CardImage, CardImageOverlay, CardLink, CardSubtitle, CardText, CardTitle, Carousel, CarouselControlNext, CarouselControlPrev, CarouselIndicators, CarouselInner, CarouselItem, CarouselOverlay, CarouselPlayPause, Checkbox, CheckboxGroup, Chip, ChipInput, CloseButton, Col, Collapse, ColorInput, Combobox, ComboboxGroup, ComboboxItem, Container, DatePicker, DateRangePicker, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle, FileInput, Flex, FloatingInput, Form, FormFeedback, FormField, FormHelp, FormLabel, Grid, GridItem, I18nProvider, Icon, InputAdorn, InputGroup, InputGroupAddon, Link, List, ListItem, Menu, MenuDivider, MenuHeader, MenuItem, MenuList, MenuSubmenu, MenuSubmenuBack, MenuText, MenuToggle, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Nav, NavItem, NavLink, NavTitle, Navbar, NavbarBrand, NavbarNav, NavbarText, NavbarToggler, Notification, NotificationIcon, NotificationStack, NotificationText, NotificationTitle, OtpInput, Pagination, PaginationItem, PasswordStrength, Placeholder, Popover, Progress, ProgressBar, Radio, RadioGroup, RangeCalendar, RangeInput, Row, Select, Skeleton, SkeletonLoader, Spinner, Stack, Stepper, StepperItem, Switch, Tab, TabList, TabPanel, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, TextInput, Textarea, Toast, ToastBody, ToastFooter, ToastHeader, ToastIcon, Toaster, Tooltip, addNotification, addToast, closeNotification, closeToast, notificationQueue, toastQueue, useDrawer, useModal, useNotification, usePagination, useToast };
```
