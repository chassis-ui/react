<!--
This file is a checked-in snapshot of @chassis-ui/react's public type surface — the exact,
rolled-up `.d.ts` a consumer's editor sees, generated from `dist/index.d.ts` (built by
`rollup-plugin-dts`, see rollup.config.mjs). It exists to make an accidental breaking change to
props/types show up as an ordinary, reviewable diff on this file, instead of only being
discovered by a consumer after publish.

Regenerate with `pnpm api:report:update` after any *intentional* public API change (new prop,
renamed export, ...) and review the diff like any other code change. `pnpm api:report` (no
`:update`) is the check that fails CI/local runs when this file and the real build have drifted.
-->

```ts
import * as React from 'react';
import React__default, { HTMLAttributes, ReactNode, ElementType, ImgHTMLAttributes, AnchorHTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, ChangeEventHandler, AllHTMLAttributes, FormHTMLAttributes, TextareaHTMLAttributes, DialogHTMLAttributes, FC, ReactElement, Key as Key$2, AriaAttributes } from 'react';
import { Key, DateValue, TableHeaderProps as TableHeaderProps$1, TableBodyProps as TableBodyProps$1, Selection, SortDescriptor, ToastQueue } from 'react-stately';
import { RangeValue, DateValue as DateValue$1, Key as Key$1 } from 'react-aria';
export { I18nProvider } from 'react-aria';

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
     * Start the item in the open state.
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
     * Size the component small or large.
     */
    size?: 'small' | 'large';
}
declare const Accordion: React__default.ForwardRefExoticComponent<AccordionProps & React__default.RefAttributes<HTMLDivElement>>;

interface AccordionBodyProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const AccordionBody: React__default.ForwardRefExoticComponent<AccordionBodyProps & React__default.RefAttributes<HTMLDivElement>>;

interface AccordionButtonProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
/**
 * @deprecated AccordionHeader already renders its own `.accordion-title` wrapper around its
 * children, so nesting this component inside it produces a duplicate wrapper. Kept for API
 * compatibility; pass content directly to AccordionHeader instead.
 */
declare const AccordionButton: React__default.ForwardRefExoticComponent<AccordionButtonProps & React__default.RefAttributes<HTMLSpanElement>>;

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
declare const Collapse: React__default.ForwardRefExoticComponent<CollapseProps & React__default.RefAttributes<HTMLDivElement>>;

/**
 * @deprecated Native <details>/<summary> handles collapse. This component is a no-op passthrough kept for API compatibility.
 */
declare const AccordionCollapse: React__default.ForwardRefExoticComponent<Omit<CollapseProps, "horizontal"> & React__default.RefAttributes<HTMLDivElement>>;

interface AccordionHeaderProps extends HTMLAttributes<HTMLElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const AccordionHeader: React__default.ForwardRefExoticComponent<AccordionHeaderProps & React__default.RefAttributes<HTMLElement>>;

interface AccordionItemProps extends HTMLAttributes<HTMLDetailsElement> {
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
declare const AccordionItem: React__default.ForwardRefExoticComponent<AccordionItemProps & React__default.RefAttributes<HTMLDetailsElement>>;

interface MenuItemDef {
    /**
     * Discriminates this entry from `MenuHeaderDef`/`MenuDividerDef` in a `MenuItemsDef`
     * array. Omit for a normal item — it's the default.
     */
    type?: 'item';
    /**
     * React key for this item.
     */
    id: Key;
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
    id: Key;
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
    id: Key;
}
/**
 * A flat array of item/header/divider definitions for data-driven rendering — headers and
 * dividers are interleaved with items in authoring order, matching how chassis-css itself
 * renders grouped items (flat DOM siblings under `.menu`, no wrapping element per group).
 *
 * Covers flat items, headers, and dividers only — nested/recursive submenus aren't
 * representable here. Compose with `children`/`MenuSubmenu` directly for those.
 */
type MenuItemsDef = (MenuItemDef | MenuHeaderDef | MenuDividerDef)[];

interface AutocompleteProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
    defaultValue?: Key | Key[] | null;
    /**
     * Prevents the autocomplete from being focused or interacted with.
     */
    disabled?: boolean;
    /**
     * A description for the field, rendered below the autocomplete.
     */
    help?: ReactNode;
    /**
     * `id` forwarded to the toggle — useful for pairing with a `<label for>`.
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
     * `AutocompleteGroup` composition instead if you need finer control over grouping.
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
    onChange?: (value: Key | Key[] | null) => void;
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
    size?: 'small' | 'large';
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
    value?: Key | Key[] | null;
}
declare const Autocomplete: {
    ({ children, className, defaultValue, disabled, help, id, invalid, invalidFeedback, items, label, multiple, name, noResultsText, onChange, placeholder, searchPlaceholder, size, valid, validFeedback, value, ...rest }: AutocompleteProps): string | number | boolean | Iterable<React__default.ReactNode> | React__default.JSX.Element | null | undefined;
    displayName: string;
};

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

type AutocompleteGroupProps = ComboboxGroupProps;
declare const AutocompleteGroup: {
    (_props: AutocompleteGroupProps): null;
    displayName: string;
};

interface ComboboxItemProps {
    /**
     * Content of the option. Must be a plain string for the option to participate in filtering
     * and typeahead — this holds even when `icon`/`description` are also set, since those are
     * purely presentational additions layered on top.
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
    id: Key;
}
declare const ComboboxItem: {
    (_props: ComboboxItemProps): null;
    displayName: string;
};

type AutocompleteItemProps = ComboboxItemProps;
declare const AutocompleteItem: {
    (_props: AutocompleteItemProps): null;
    displayName: string;
};

/**
 * Context colors
 */
type ContextColor = 'default' | 'alternate' | 'primary' | 'secondary' | 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'black' | 'white';
/**
 * Context styles
 */
type ContextStyle = 'basic' | 'solid' | 'outline' | 'smooth';
/**
 * Component sizes
 */
type Sizing = 'small' | 'medium' | 'large';
/**
 * Extended sizes
 */
type ExtendedSizing = '2xsmall' | 'xsmall' | Sizing | 'xlarge' | '2xlarge';
/**
 * Component shapes
 */
type Shapes = 'rounded' | 'rounded-top' | 'rounded-end' | 'rounded-bottom' | 'rounded-start' | 'rounded-circle' | 'rounded-pill' | 'rounded-0' | 'rounded-1' | 'rounded-2' | 'rounded-3';

interface AvatarProps extends HTMLAttributes<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement> {
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
     * Defaults to `button`, or `a` when `href` is set.
     */
    component?: string | ElementType;
    /**
     * Image source. When set, renders an `AvatarImage` in place of `children`.
     */
    src?: string;
    /**
     * Alt text for the image rendered when `src` is set.
     */
    alt?: string;
    /**
     * Renders the avatar as a link to this URL. Defaults `component` to `a`.
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
}
declare const Avatar: React__default.ForwardRefExoticComponent<AvatarProps & React__default.RefAttributes<HTMLSpanElement | HTMLButtonElement | HTMLAnchorElement>>;

interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
}
declare const AvatarImage: React__default.ForwardRefExoticComponent<AvatarImageProps & React__default.RefAttributes<HTMLImageElement>>;

interface AvatarStackItemDef {
    /**
     * React key for the rendered `Avatar`. Falls back to the item's index in `data`.
     */
    key?: string | number;
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
    component?: string | React__default.ElementType;
}
interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Sets the size of every `Avatar` in the stack to one of Chassis component sizes.
     */
    size?: ExtendedSizing;
    /**
     * Renders a `Avatar` for each item, ahead of any JSX `children` (handy for a trailing "+N"
     * overflow avatar).
     */
    items?: AvatarStackItemDef[];
}
declare const AvatarStack: React__default.ForwardRefExoticComponent<AvatarStackProps & React__default.RefAttributes<HTMLDivElement>>;

interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Sets the color of the component to one of Chassis context colors.
     */
    color?: ContextColor;
    /**
     * Optionally add a close button to the notification and allow it to self dismiss.
     */
    dismissible?: boolean;
    /**
     * Style variant for the notification.
     */
    variant?: 'solid';
    /**
     * Callback fired when the component requests to be closed.
     */
    onClose?: () => void;
    /**
     * Toggle the visibility of component.
     */
    visible?: boolean;
}
declare const Notification: React__default.ForwardRefExoticComponent<NotificationProps & React__default.RefAttributes<HTMLDivElement>>;

interface NotificationHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const NotificationHeading: React__default.ForwardRefExoticComponent<NotificationHeadingProps & React__default.RefAttributes<HTMLHeadingElement>>;

interface NotificationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const NotificationLink: React__default.ForwardRefExoticComponent<NotificationLinkProps & React__default.RefAttributes<HTMLAnchorElement>>;

interface BadgeProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
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
    component?: string | ElementType;
    /**
     * Position badge in one of the corners of a link or button.
     */
    position?: 'top-start' | 'top-end' | 'bottom-end' | 'bottom-start';
    /**
     * Select the shape of the component.
     */
    circle?: boolean;
    /**
     * Sets the size of the component to one of Chassis component sizes.
     */
    size?: Sizing;
}
declare const Badge: React__default.ForwardRefExoticComponent<BadgeProps & React__default.RefAttributes<HTMLDivElement | HTMLSpanElement>>;

interface BackdropProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Toggle the visibility of modal component.
     */
    visible?: boolean;
}
declare const Backdrop: React__default.ForwardRefExoticComponent<BackdropProps & React__default.RefAttributes<HTMLDivElement>>;

interface BreadcrumbItemDef {
    /**
     * Label for the breadcrumb item.
     */
    label: React__default.ReactNode;
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
declare const Breadcrumb: React__default.ForwardRefExoticComponent<BreadcrumbProps & React__default.RefAttributes<HTMLOListElement>>;

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
declare const BreadcrumbItem: React__default.ForwardRefExoticComponent<BreadcrumbItemProps & React__default.RefAttributes<HTMLLIElement>>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Toggle the active state for the component.
     */
    active?: boolean;
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
    component?: string | ElementType;
    /**
     * Toggle the disabled state for the component.
     */
    disabled?: boolean;
    /**
     * The href attribute specifies the URL of the page the link goes to.
     */
    href?: string;
    /**
     * The role attribute describes the role of an element in programs that can make use of it, such as screen readers or magnifiers.
     */
    role?: string;
    /**
     * Select the shape of the component.
     */
    shape?: Shapes;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
    /**
     * Specifies the type of button. Always specify the type attribute for the `<button>` element.
     * Different browsers may use different default types for the `<button>` element.
     */
    type?: 'button' | 'submit' | 'reset';
    /**
     * Set the button style variant.
     */
    variant?: ContextStyle;
}
declare const Button: React__default.ForwardRefExoticComponent<ButtonProps & React__default.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
    /**
     * Create a set of buttons that appear vertically stacked rather than horizontally. Split button dropdowns are not supported here.
     */
    vertical?: boolean;
}
declare const ButtonGroup: React__default.ForwardRefExoticComponent<ButtonGroupProps & React__default.RefAttributes<HTMLDivElement>>;

interface ButtonToolbarProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const ButtonToolbar: React__default.ForwardRefExoticComponent<ButtonToolbarProps & React__default.RefAttributes<HTMLDivElement>>;

interface CalendarBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
    firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
    /**
     * Callback that is called for each date in the calendar. If it returns `true`, that date is
     * shown but cannot be selected.
     */
    isDateUnavailable?: (date: DateValue) => boolean;
    /**
     * The maximum allowed date that a user may select.
     */
    maxValue?: DateValue | null;
    /**
     * The minimum allowed date that a user may select.
     */
    minValue?: DateValue | null;
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
    defaultValue?: DateValue | null;
    /**
     * Callback fired when the selected date changes. Unlike `DatePicker`'s `onChange` (whose
     * segmented field can be cleared to `null`), a calendar selection is always a concrete date.
     */
    onChange?: (value: DateValue) => void;
    /**
     * Whether a single date or multiple, independently toggled dates can be selected.
     *
     * @default 'single'
     */
    selectionMode?: 'single';
    /**
     * The selected date (controlled).
     */
    value?: DateValue | null;
}
interface CalendarMultipleProps extends CalendarBaseProps {
    /**
     * The initial selected dates (uncontrolled).
     */
    defaultValue?: DateValue[] | null;
    /**
     * Callback fired when the set of selected dates changes.
     */
    onChange?: (value: DateValue[]) => void;
    /**
     * Whether a single date or multiple, independently toggled dates can be selected.
     *
     * @default 'single'
     */
    selectionMode: 'multiple';
    /**
     * The selected dates (controlled).
     */
    value?: DateValue[] | null;
}
type CalendarProps = CalendarSingleProps | CalendarMultipleProps;
declare const Calendar: React__default.ForwardRefExoticComponent<CalendarProps & React__default.RefAttributes<HTMLDivElement>>;

interface DateRangePreset {
    label: string;
    range: RangeValue<DateValue$1>;
}

interface RangeCalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
    defaultValue?: RangeValue<DateValue> | null;
    /**
     * Prevents the calendar from being focused or interacted with.
     */
    disabled?: boolean;
    /**
     * The day that starts the week, overriding the default set by the active locale.
     *
     * @default 'mon'
     */
    firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
    /**
     * Callback that is called for each date in the calendar. If it returns `true`, that date is
     * shown but cannot be selected.
     */
    isDateUnavailable?: (date: DateValue) => boolean;
    /**
     * The maximum allowed date that a user may select.
     */
    maxValue?: DateValue | null;
    /**
     * The minimum allowed date that a user may select.
     */
    minValue?: DateValue | null;
    /**
     * Callback fired when a complete range is selected (both a start and end date).
     */
    onChange?: (value: RangeValue<DateValue>) => void;
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
    value?: RangeValue<DateValue> | null;
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
declare const RangeCalendar: React__default.ForwardRefExoticComponent<RangeCalendarProps & React__default.RefAttributes<HTMLDivElement>>;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Sets the color of the component to one of Chassis context colors.
     */
    color?: ContextColor;
    /**
     * Sets the text context color of the component to one of Chassis context colors.
     *
     * @type ContextColor | 'main' | 'subtle' | 'slight' | 'inverse' | 'solid' | 'highlight' | 'idle' | 'disabled' | 'hover' | 'press' | string
     */
    textColor?: string;
}
declare const Card: React__default.ForwardRefExoticComponent<CardProps & React__default.RefAttributes<HTMLDivElement>>;

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const CardBody: React__default.ForwardRefExoticComponent<CardBodyProps & React__default.RefAttributes<HTMLDivElement>>;

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const CardFooter: React__default.ForwardRefExoticComponent<CardFooterProps & React__default.RefAttributes<HTMLDivElement>>;

interface CardGroupProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const CardGroup: React__default.ForwardRefExoticComponent<CardGroupProps & React__default.RefAttributes<HTMLDivElement>>;

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const CardHeader: React__default.ForwardRefExoticComponent<CardHeaderProps & React__default.RefAttributes<HTMLDivElement>>;

interface CardImageProps extends HTMLAttributes<HTMLImageElement | HTMLOrSVGElement | HTMLOrSVGImageElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
    /**
     * Optionally orientate the image to the top, bottom, or make it overlaid across the card.
     */
    orientation?: 'top' | 'bottom';
}
declare const CardImage: React__default.ForwardRefExoticComponent<CardImageProps & React__default.RefAttributes<HTMLOrSVGElement | HTMLOrSVGImageElement>>;

interface CardImageOverlayProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const CardImageOverlay: React__default.ForwardRefExoticComponent<CardImageOverlayProps & React__default.RefAttributes<HTMLDivElement>>;

interface CardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * The href attribute specifies the URL of the page the link goes to.
     */
    href?: string;
}
declare const CardLink: React__default.ForwardRefExoticComponent<CardLinkProps & React__default.RefAttributes<HTMLAnchorElement>>;

interface CardSubtitleProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const CardSubtitle: React__default.ForwardRefExoticComponent<CardSubtitleProps & React__default.RefAttributes<HTMLHeadingElement>>;

interface CardTextProps extends HTMLAttributes<HTMLParagraphElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const CardText: React__default.ForwardRefExoticComponent<CardTextProps & React__default.RefAttributes<HTMLParagraphElement>>;

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const CardTitle: React__default.ForwardRefExoticComponent<CardTitleProps & React__default.RefAttributes<HTMLHeadingElement>>;

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * index of the active item.
     */
    activeIndex?: number;
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Adding in the previous and next controls.
     */
    controls?: boolean;
    /**
     * Add darker controls, indicators, and captions.
     */
    dark?: boolean;
    /**
     * The amount of time to delay between automatically cycling an item. If false, carousel will not automatically cycle.
     */
    interval?: boolean | number;
    /**
     * Adding indicators at the bottom of the carousel for each item.
     */
    indicators?: boolean;
    /**
     * Callback fired when a slide transition end.
     */
    onSlid?: (active: number, direction: string) => void;
    /**
     * Callback fired when a slide transition starts.
     */
    onSlide?: (active: number, direction: string) => void;
    /**
     * If set to 'hover', pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on mouseleave. If set to false, hovering over the carousel won't pause it.
     */
    pause?: boolean | 'hover';
    /**
     * Set type of the transition.
     */
    transition?: 'slide' | 'crossfade';
    /**
     * Set whether the carousel should cycle continuously or have hard stops.
     */
    wrap?: boolean;
}
declare const Carousel: React__default.ForwardRefExoticComponent<CarouselProps & React__default.RefAttributes<HTMLDivElement>>;

interface CarouselCaptionProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const CarouselCaption: React__default.ForwardRefExoticComponent<CarouselCaptionProps & React__default.RefAttributes<HTMLDivElement>>;

interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * @ignore
     */
    active?: boolean;
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * @ignore
     */
    direction?: string;
    /**
     * The amount of time to delay between automatically cycling an item.
     */
    interval?: boolean | number;
}
declare const CarouselItem: React__default.ForwardRefExoticComponent<CarouselItemProps & React__default.RefAttributes<HTMLDivElement>>;

interface ChipInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
     * chip.
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
    separator?: string | null;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
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
declare const ChipInput: {
    ({ allowDuplicates, chipVariant, className, defaultValue, disabled, help, id, invalid, invalidFeedback, label, maxChips, name, onChange, placeholder, separator, size, valid, validFeedback, value, ...rest }: ChipInputProps): string | number | boolean | Iterable<React__default.ReactNode> | React__default.JSX.Element | null | undefined;
    displayName: string;
};

interface CloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Toggle the disabled state for the component.
     */
    disabled?: boolean;
    /**
     * Change the default context to white.
     */
    white?: boolean;
}
declare const CloseButton: React__default.ForwardRefExoticComponent<CloseButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

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
declare const ColorInput: React__default.ForwardRefExoticComponent<ColorInputProps & React__default.RefAttributes<HTMLInputElement>>;

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
    size?: 'small' | 'large';
    /**
     * Set component validation state to valid.
     */
    valid?: boolean;
    /**
     * A success message for the field, rendered below the input when `valid` is set.
     */
    validFeedback?: ReactNode;
}
declare const FileInput: React__default.ForwardRefExoticComponent<FileInputProps & React__default.RefAttributes<HTMLInputElement>>;

interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
    defaultValue?: Key | null;
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
     * you need finer control over grouping.
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
    onChange?: (value: Key | null) => void;
    /**
     * Placeholder shown in the input when nothing is selected.
     */
    placeholder?: string;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
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
    value?: Key | null;
}
declare const Combobox: {
    ({ children, className, defaultValue, disabled, help, id, invalid, invalidFeedback, items, label, name, noResultsText, onChange, placeholder, size, valid, validFeedback, value, ...rest }: ComboboxProps): string | number | boolean | Iterable<React__default.ReactNode> | React__default.JSX.Element | null | undefined;
    displayName: string;
};

interface DatePickerBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
    firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
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
    isDateUnavailable?: (date: DateValue) => boolean;
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
    maxValue?: DateValue | null;
    /**
     * The minimum allowed date that a user may select.
     */
    minValue?: DateValue | null;
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
    size?: 'small' | 'large';
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
    defaultValue?: DateValue | null;
    /**
     * Callback fired when the selected date changes.
     */
    onChange?: (value: DateValue | null) => void;
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
    value?: DateValue | null;
}
interface DatePickerMultipleProps extends DatePickerBaseProps {
    /**
     * The initial selected dates (uncontrolled).
     */
    defaultValue?: DateValue[] | null;
    /**
     * Callback fired when the set of selected dates changes.
     */
    onChange?: (value: DateValue[]) => void;
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
    value?: DateValue[] | null;
}
type DatePickerProps = DatePickerSingleProps | DatePickerMultipleProps;
declare const DatePicker: {
    (props: DatePickerProps): React__default.JSX.Element;
    displayName: string;
};

interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
    defaultValue?: RangeValue<DateValue> | null;
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
    firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
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
    isDateUnavailable?: (date: DateValue) => boolean;
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
    maxValue?: DateValue | null;
    /**
     * The minimum allowed date that a user may select.
     */
    minValue?: DateValue | null;
    /**
     * Base `name` for a pair of auto-created hidden inputs, kept in sync with the selection, for
     * native form submission — rendered as `${name}Start` and `${name}End`. Omit to skip creating
     * them.
     */
    name?: string;
    /**
     * Callback fired when the selected date range changes.
     */
    onChange?: (value: RangeValue<DateValue> | null) => void;
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
    size?: 'small' | 'large';
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
    value?: RangeValue<DateValue> | null;
    /**
     * Number of months to display side by side in the calendar overlay.
     *
     * @default 1
     */
    visibleMonths?: number;
}
declare const DateRangePicker: {
    ({ className, defaultOpen, defaultValue, disabled, firstDayOfWeek, help, id, invalid, invalidFeedback, isDateUnavailable, isOpen, label, maxValue, minValue, name, onChange, onOpenChange, presets, size, unavailableDates, valid, validFeedback, value, visibleMonths, ...rest }: DateRangePickerProps): string | number | boolean | Iterable<React__default.ReactNode> | React__default.JSX.Element | null | undefined;
    displayName: string;
};

interface OtpInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
    size?: 'small' | 'large';
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
declare const OtpInput: {
    ({ className, defaultValue, disabled, groupSizes, help, id, inputGroup, invalid, invalidFeedback, label, length, mask, name, onChange, onComplete, separator, size, valid, validFeedback, value, ...rest }: OtpInputProps): string | number | boolean | Iterable<React__default.ReactNode> | React__default.JSX.Element | null | undefined;
    displayName: string;
};

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';
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
     * Minimum password length required to earn the first strength point. Defaults to `8`.
     */
    minLength?: number;
    /**
     * Feedback message shown for each strength level, when `showText` is `true`.
     */
    messages?: Partial<Record<StrengthLevel, string>>;
    /**
     * Callback fired whenever the strength level changes.
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
    ({ "aria-label": ariaLabel, className, id, messages, minLength, onStrengthChange, scorer, showText, thresholds, value, variant, weights, ...rest }: PasswordStrengthProps): React__default.JSX.Element;
    displayName: string;
};

type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

type MenuAutoClose = boolean | 'inside' | 'outside';
interface MenuProps extends HTMLAttributes<HTMLElement> {
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
    component?: string | ElementType;
    /**
     * Teleports the menu panel to a container element on open. Accepts an element reference, or
     * `true` to append to `document.body`.
     */
    container?: boolean | Element;
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
    reference?: 'toggle' | 'parent';
    /**
     * Toggle the visibility of the menu component.
     */
    visible?: boolean;
}
declare const Menu: React__default.ForwardRefExoticComponent<MenuProps & React__default.RefAttributes<HTMLElement>>;

interface MenuDividerProps extends HTMLAttributes<HTMLHRElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
}
declare const MenuDivider: React__default.ForwardRefExoticComponent<MenuDividerProps & React__default.RefAttributes<HTMLHRElement>>;

interface MenuHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const MenuHeader: React__default.ForwardRefExoticComponent<MenuHeaderProps & React__default.RefAttributes<HTMLHeadingElement>>;

interface LinkProps extends AllHTMLAttributes<HTMLElement> {
    /**
     * Toggle the active state for the component.
     */
    active?: boolean;
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
    /**
     * Toggle the disabled state for the component.
     */
    disabled?: boolean;
    /**
     * The href attribute specifies the URL of the page the link goes to.
     */
    href?: string;
}
declare const Link: React__default.ForwardRefExoticComponent<LinkProps & React__default.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;

interface MenuItemProps extends LinkProps {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
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
}
declare const MenuItem: React__default.ForwardRefExoticComponent<MenuItemProps & React__default.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;

interface MenuListProps extends HTMLAttributes<HTMLElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
    /**
     * Array of item/header/divider definitions for data-driven rendering. When provided, children
     * are ignored. Covers flat items, headers, and dividers only — for nested submenus, compose
     * with `children` and `MenuSubmenu` instead.
     */
    items?: MenuItemsDef;
}
declare const MenuList: React__default.ForwardRefExoticComponent<MenuListProps & React__default.RefAttributes<HTMLElement>>;

interface MenuTextProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const MenuText: React__default.ForwardRefExoticComponent<MenuTextProps & React__default.RefAttributes<HTMLSpanElement>>;

type MenuToggleProps = Omit<ButtonProps, 'type'>;
declare const MenuToggle: React__default.ForwardRefExoticComponent<MenuToggleProps & React__default.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;

interface MenuSubmenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    /**
     * MenuSubmenu activation mode on hover-capable devices. `'click'` activates on click only.
     * `'hover'` activates on hover only. `'both'` (the default) activates on both. Touch
     * devices always use tap regardless of this setting.
     */
    activation?: 'click' | 'hover' | 'both';
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
declare const MenuSubmenu: React__default.ForwardRefExoticComponent<MenuSubmenuProps & React__default.RefAttributes<HTMLDivElement>>;

interface MenuSubmenuBackProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
}
declare const MenuSubmenuBack: React__default.ForwardRefExoticComponent<MenuSubmenuBackProps & React__default.RefAttributes<HTMLButtonElement>>;

type Span = 'auto' | number | string | boolean | null;
type BPObject$1 = {
    span?: Span;
    offset?: number | string | null;
    order?: 'first' | 'last' | number | string | null;
};
interface ColProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * The number of columns/offset/order on extra small devices (<576px).
     *
     * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
     */
    xs?: Col;
    /**
     * The number of columns/offset/order on small devices (<768px).
     *
     * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
     */
    sm?: Col;
    /**
     * The number of columns/offset/order on medium devices (<992px).
     *
     * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
     */
    md?: Col;
    /**
     * The number of columns/offset/order on large devices (<1200px).
     *
     * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
     */
    lg?: Col;
    /**
     * The number of columns/offset/order on X-Large devices (<1400px).
     *
     * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
     */
    xl?: Col;
    /**
     * The number of columns/offset/order on XX-Large devices (≥1400px).
     *
     * @type { 'auto' | number | string | boolean | { span: 'auto' | number | string | boolean } | { offset: number | string } | { order: 'first' | 'last' | number | string }}
     */
    xxl?: Col;
}
type Col = Span | BPObject$1;
declare const Col: React__default.ForwardRefExoticComponent<ColProps & React__default.RefAttributes<HTMLDivElement>>;

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Set container 100% wide until small breakpoint.
     */
    sm?: boolean;
    /**
     * Set container 100% wide until medium breakpoint.
     */
    md?: boolean;
    /**
     * Set container 100% wide until large breakpoint.
     */
    lg?: boolean;
    /**
     * Set container 100% wide until X-large breakpoint.
     */
    xl?: boolean;
    /**
     * Set container 100% wide until XX-large breakpoint.
     */
    xxl?: boolean;
    /**
     * Set container 100% wide, spanning the entire width of the viewport.
     */
    fluid?: boolean;
}
declare const Container: React__default.ForwardRefExoticComponent<ContainerProps & React__default.RefAttributes<HTMLDivElement>>;

type BPObject = {
    cols?: 'auto' | number | string | null;
    gutter?: number | string | null;
    gutterX?: number | string | null;
    gutterY?: number | string | null;
};
interface RowProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * The number of columns/offset/order on extra small devices (<576px).
     *
     * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
     */
    xs?: BPObject;
    /**
     * The number of columns/offset/order on small devices (<768px).
     *
     * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
     */
    sm?: BPObject;
    /**
     * The number of columns/offset/order on medium devices (<992px).
     *
     * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
     */
    md?: BPObject;
    /**
     * The number of columns/offset/order on large devices (<1200px).
     *
     * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
     */
    lg?: BPObject;
    /**
     * The number of columns/offset/order on X-Large devices (<1400px).
     *
     * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
     */
    xl?: BPObject;
    /**
     * The number of columns/offset/order on XX-Large devices (≥1400px).
     *
     * @type {{ cols: 'auto' | number | string } | { gutter: number | string } | { gutterX: number | string } | { gutterY: number | string }}
     */
    xxl?: BPObject;
}
declare const Row: React__default.ForwardRefExoticComponent<RowProps & React__default.RefAttributes<HTMLDivElement>>;

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
    size?: 'small' | 'large';
    /**
     * Set the button variant to an outlined button or a ghost button.
     */
    variant?: 'outline' | 'ghost';
};

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
    label?: string | ReactNode;
    /**
     * Callback fired when the selected state changes. Ignored when rendered inside a `<CheckboxGroup>` —
     * use the group's `onChange` instead.
     */
    onChange?: (isSelected: boolean) => void;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
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
declare const Checkbox: React__default.ForwardRefExoticComponent<CheckboxProps & React__default.RefAttributes<HTMLInputElement>>;

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
declare const CheckboxGroup: React__default.ForwardRefExoticComponent<CheckboxGroupProps & React__default.RefAttributes<HTMLFieldSetElement>>;

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
declare const Form: React__default.ForwardRefExoticComponent<FormProps & React__default.RefAttributes<HTMLFormElement>>;

interface FormLabelProps extends AllHTMLAttributes<HTMLLabelElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * A string of all className you want to be applied to the component, and override standard className value.
     */
    customClassName?: string;
}
declare const FormLabel: React__default.ForwardRefExoticComponent<FormLabelProps & React__default.RefAttributes<HTMLLabelElement>>;

interface FormHelpProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const FormHelp: React__default.ForwardRefExoticComponent<FormHelpProps & React__default.RefAttributes<HTMLDivElement | HTMLSpanElement>>;

interface FormFeedbackProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
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
}
declare const FormFeedback: React__default.ForwardRefExoticComponent<FormFeedbackProps & React__default.RefAttributes<HTMLDivElement | HTMLSpanElement>>;

interface FloatingInputProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
}
declare const FloatingInput: React__default.ForwardRefExoticComponent<FloatingInputProps & React__default.RefAttributes<HTMLDivElement>>;

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
    ({ children, className, help, ids, invalid, invalidFeedback, label, valid, validFeedback }: FormFieldProps): string | number | boolean | Iterable<ReactNode> | React.JSX.Element | null | undefined;
    displayName: string;
};

interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
}
declare const InputGroup: React__default.ForwardRefExoticComponent<InputGroupProps & React__default.RefAttributes<HTMLDivElement>>;

interface InputGroupAddonProps extends HTMLAttributes<HTMLLabelElement | HTMLSpanElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const InputGroupAddon: React__default.ForwardRefExoticComponent<InputGroupAddonProps & React__default.RefAttributes<HTMLSpanElement | HTMLLabelElement>>;

interface InputAdornProps extends HTMLAttributes<HTMLElement>, Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'rel' | 'target'>, Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component. Use
     * `"button"` or `"a"` for an actionable adorn, e.g. a password reveal toggle or a clear button.
     */
    component?: string | ElementType;
}
declare const InputAdorn: React__default.ForwardRefExoticComponent<InputAdornProps & React__default.RefAttributes<HTMLElement>>;

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
    label?: string | ReactNode;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
    /**
     * The value of the radio button, used to identify it within its `<RadioGroup>`.
     */
    value: string;
}
declare const Radio: React__default.ForwardRefExoticComponent<RadioProps & React__default.RefAttributes<HTMLInputElement>>;

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
declare const RadioGroup: React__default.ForwardRefExoticComponent<RadioGroupProps & React__default.RefAttributes<HTMLFieldSetElement>>;

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
    value?: string | string[] | number;
}
declare const RangeInput: React__default.ForwardRefExoticComponent<RangeInputProps & React__default.RefAttributes<HTMLInputElement>>;

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
    value?: string | number;
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
    size?: 'small' | 'large';
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
    value?: string | string[] | number;
}
declare const Select: React__default.ForwardRefExoticComponent<SelectProps & React__default.RefAttributes<HTMLSelectElement>>;

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
    label?: string | ReactNode;
    /**
     * Callback fired when the selected state changes.
     */
    onChange?: (isSelected: boolean) => void;
    /**
     * Size the component small or large.
     */
    size?: 'small' | 'large';
    /**
     * Specifies the type of component.
     */
    type?: 'checkbox' | 'radio';
    /**
     * Set component validation state to valid.
     */
    valid?: boolean;
}
declare const Switch: React__default.ForwardRefExoticComponent<SwitchProps & React__default.RefAttributes<HTMLInputElement>>;

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
    size?: 'small' | 'large';
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
declare const TextInput: React__default.ForwardRefExoticComponent<TextInputProps & React__default.RefAttributes<HTMLInputElement>>;

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
    size?: 'small' | 'large';
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
declare const Textarea: React__default.ForwardRefExoticComponent<TextareaProps & React__default.RefAttributes<HTMLTextAreaElement>>;

interface IconProps extends HTMLAttributes<HTMLSpanElement | SVGSVGElement> {
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
     * Render as a `cx-{name}` font glyph `<span>` instead of an SVG `<use>` reference.
     */
    font?: boolean;
    /**
     * Accessible name. When set, the icon is exposed to assistive tech instead of hidden.
     */
    title?: string;
    /**
     * Path to the SVG sprite file. Ignored in `font` mode.
     */
    sprite?: string;
}
declare const Icon: React__default.ForwardRefExoticComponent<IconProps & React__default.RefAttributes<HTMLSpanElement | SVGSVGElement>>;

interface ImageProps extends ImgHTMLAttributes<HTMLOrSVGImageElement> {
    /**
     * Set the horizontal aligment.
     */
    align?: 'start' | 'center' | 'end';
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Make image responsive.
     */
    fluid?: boolean;
    /**
     * Make image rounded.
     */
    rounded?: boolean;
    /**
     * Give an image a rounded 1px border appearance.
     */
    thumbnail?: boolean;
}
declare const Image: React__default.ForwardRefExoticComponent<ImageProps & React__default.RefAttributes<HTMLImageElement>>;

interface ListItemDef {
    /**
     * Item label content.
     */
    label: React__default.ReactNode;
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
interface ListProps extends HTMLAttributes<HTMLDivElement | HTMLUListElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
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
    layout?: 'horizontal' | 'small:horizontal' | 'medium:horizontal' | 'large:horizontal' | 'xlarge:horizontal' | '2xlarge:horizontal';
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
}
declare const List: React__default.ForwardRefExoticComponent<ListProps & React__default.RefAttributes<HTMLDivElement | HTMLUListElement>>;

interface ListItemProps extends HTMLAttributes<HTMLLIElement | HTMLAnchorElement | HTMLButtonElement> {
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
    component?: string | ElementType;
}
declare const ListItem: React__default.ForwardRefExoticComponent<ListItemProps & React__default.RefAttributes<HTMLButtonElement | HTMLAnchorElement | HTMLLIElement>>;

interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'onCancel' | 'onClose'> {
    /**
     * Show a backdrop while the modal is open. `'static'` blocks closing on backdrop click
     * (the modal bounces instead).
     */
    backdrop?: boolean | 'static';
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Set modal to cover the entire user viewport. A breakpoint value goes fullscreen only
     * below that breakpoint.
     */
    fullscreen?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
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
    size?: 'small' | 'large' | 'xlarge';
    /**
     * Toggle the visibility of modal component.
     */
    visible?: boolean;
}
declare const Modal: React__default.ForwardRefExoticComponent<ModalProps & React__default.RefAttributes<HTMLDialogElement>>;

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const ModalBody: React__default.ForwardRefExoticComponent<ModalBodyProps & React__default.RefAttributes<HTMLDivElement>>;

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Stack the footer actions as full-width columns instead of a right-aligned row.
     */
    stacked?: boolean;
}
declare const ModalFooter: React__default.ForwardRefExoticComponent<ModalFooterProps & React__default.RefAttributes<HTMLDivElement>>;

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Add a close button component to the header.
     */
    closeButton?: boolean;
}
declare const ModalHeader: React__default.ForwardRefExoticComponent<ModalHeaderProps & React__default.RefAttributes<HTMLDivElement>>;

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const ModalTitle: React__default.ForwardRefExoticComponent<ModalTitleProps & React__default.RefAttributes<HTMLHeadElement>>;

interface NavItemDef {
    /**
     * Label content for the nav item.
     */
    label: React__default.ReactNode;
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
interface NavProps extends HTMLAttributes<HTMLDivElement | HTMLUListElement | HTMLOListElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
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
    variant?: 'tabs' | 'pills';
}
declare const Nav: React__default.ForwardRefExoticComponent<NavProps & React__default.RefAttributes<HTMLDivElement | HTMLOListElement | HTMLUListElement>>;

interface NavLinkProps extends LinkProps {
    /**
     * Toggle the active state for the component.
     */
    active?: boolean;
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
    /**
     * Toggle the disabled state for the component.
     */
    disabled?: boolean;
    /**
     * @ignore
     */
    to?: string;
}
declare const NavLink: React__default.ForwardRefExoticComponent<NavLinkProps & React__default.RefAttributes<HTMLButtonElement | HTMLAnchorElement>>;

declare const NavItem: React__default.ForwardRefExoticComponent<NavLinkProps & React__default.RefAttributes<HTMLLIElement>>;

interface NavTitleProps extends HTMLAttributes<HTMLLIElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
}
declare const NavTitle: React__default.ForwardRefExoticComponent<NavTitleProps & React__default.RefAttributes<HTMLLIElement>>;

interface NavbarProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Sets the color of the component to one of Chassis context colors.
     */
    color?: ContextColor;
    /**
     * Sets if the context of text should be colored for a light or dark dark background.
     */
    colorScheme?: 'dark' | 'light';
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
    /**
     * Defines optional container wrapping children elements.
     */
    container?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | 'fluid';
    /**
     * Defines the responsive breakpoint to determine when content collapses.
     */
    expand?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
    /**
     * Place component in non-static positions.
     */
    placement?: 'fixed-top' | 'fixed-bottom' | 'sticky-top';
}
declare const Navbar: React__default.ForwardRefExoticComponent<NavbarProps & React__default.RefAttributes<HTMLDivElement>>;

interface NavbarBrandProps extends HTMLAttributes<HTMLAnchorElement | HTMLSpanElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     *
     */
    component?: string | ElementType;
    /**
     * The href attribute specifies the URL of the page the link goes to.
     */
    href?: string;
}
declare const NavbarBrand: React__default.ForwardRefExoticComponent<NavbarBrandProps & React__default.RefAttributes<HTMLSpanElement | HTMLAnchorElement>>;

interface NavbarNavProps extends HTMLAttributes<HTMLDivElement | HTMLUListElement> {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const NavbarNav: React__default.ForwardRefExoticComponent<NavbarNavProps & React__default.RefAttributes<HTMLDivElement | HTMLUListElement>>;

interface NavbarTextProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const NavbarText: React__default.ForwardRefExoticComponent<NavbarTextProps & React__default.RefAttributes<HTMLSpanElement>>;

interface NavbarTogglerProps extends HTMLAttributes<HTMLButtonElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const NavbarToggler: React__default.ForwardRefExoticComponent<NavbarTogglerProps & React__default.RefAttributes<HTMLButtonElement>>;

interface PaginationProps extends HTMLAttributes<HTMLUListElement> {
    /**
     * Current active page (1-indexed). Used with `pages` for data-driven mode.
     */
    activePage?: number;
    /**
     * Set the alignment of pagination components.
     */
    align?: 'start' | 'center' | 'end';
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Maximum number of visible page buttons (default: 5). Flanking pages are collapsed to ellipsis.
     */
    maxVisiblePages?: number;
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
     * Size the component small or large.
     */
    size?: 'small' | 'large';
}
declare const Pagination: React__default.ForwardRefExoticComponent<PaginationProps & React__default.RefAttributes<HTMLUListElement>>;

interface PaginationItemProps extends HTMLAttributes<HTMLAnchorElement> {
    /**
     * Toggle the active state for the component.
     */
    active?: boolean;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
    /**
     * Toggle the disabled state for the component.
     */
    disabled?: boolean;
    /**
     * The href attribute. When provided the item renders as an `<a>` tag; otherwise as a `<button>`.
     */
    href?: string;
}
declare const PaginationItem: React__default.ForwardRefExoticComponent<PaginationItemProps & React__default.RefAttributes<HTMLAnchorElement>>;

interface PlaceholderProps extends HTMLAttributes<HTMLSpanElement> {
    /**
     * Set animation type to better convey the perception of something being actively loaded.
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
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
    /**
     * Size the component extra small, small, or large.
     */
    size?: 'xsmall' | 'small' | 'large';
    /**
     * The number of columns on extra small devices (<576px).
     */
    xs?: number;
    /**
     * The number of columns on small devices (<768px).
     */
    sm?: number;
    /**
     * The number of columns on medium devices (<992px).
     */
    md?: number;
    /**
     * The number of columns on large devices (<1200px).
     */
    lg?: number;
    /**
     * The number of columns on X-Large devices (<1400px).
     */
    xl?: number;
    /**
     * The number of columns on XX-Large devices (≥1400px).
     */
    xxl?: number;
}
declare const Placeholder: React__default.ForwardRefExoticComponent<PlaceholderProps & React__default.RefAttributes<HTMLSpanElement>>;

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
    trigger?: 'hover' | 'focus';
    /**
     * Toggle the visibility of the tooltip component.
     */
    visible?: boolean;
}
declare const Tooltip: FC<TooltipProps>;

interface PopoverProps {
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

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
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
     * The percent to progress the ProgressBar.
     */
    value?: number;
    /**
     * Set the progress bar variant to optional striped.
     */
    variant?: 'striped';
}
declare const ProgressBar: React__default.ForwardRefExoticComponent<ProgressBarProps & React__default.RefAttributes<HTMLDivElement>>;

interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, ProgressBarProps {
    /**
     * A string of all className you want applied to the component.
     */
    className?: string;
    /**
     * Sets the height of the component. If you set that value the inner `<ProgressBar>` will automatically resize accordingly.
     */
    height?: number;
    /**
     * Makes progress bar thinner.
     */
    thin?: boolean;
    /**
     * The percent to progress the ProgressBar (out of 100).
     */
    value?: number;
    /**
     * Change the default context to white.
     */
    white?: boolean;
}
declare const Progress: React__default.ForwardRefExoticComponent<ProgressProps & React__default.RefAttributes<HTMLDivElement>>;

interface DrawerProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'onCancel' | 'onClose'> {
    /**
     * Show a backdrop while the drawer is open. `'static'` blocks closing on backdrop click
     * (the drawer nudges instead).
     */
    backdrop?: boolean | 'static';
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
    placement: 'start' | 'end' | 'top' | 'bottom';
    /**
     * Renders as a drawer only below this breakpoint — inline as a flex container above it.
     */
    responsive?: 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
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
declare const Drawer: React__default.ForwardRefExoticComponent<DrawerProps & React__default.RefAttributes<HTMLDialogElement>>;

interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const DrawerBody: React__default.ForwardRefExoticComponent<DrawerBodyProps & React__default.RefAttributes<HTMLDivElement>>;

interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Stack the footer actions as full-width columns instead of a right-aligned row.
     */
    stacked?: boolean;
}
declare const DrawerFooter: React__default.ForwardRefExoticComponent<DrawerFooterProps & React__default.RefAttributes<HTMLDivElement>>;

interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Add a close button component to the header.
     */
    closeButton?: boolean;
}
declare const DrawerHeader: React__default.ForwardRefExoticComponent<DrawerHeaderProps & React__default.RefAttributes<HTMLDivElement>>;

interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const DrawerTitle: React__default.ForwardRefExoticComponent<DrawerTitleProps & React__default.RefAttributes<HTMLHeadElement>>;

interface SpinnerProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
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
    component?: string | ElementType;
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
}
declare const Spinner: React__default.ForwardRefExoticComponent<SpinnerProps & React__default.RefAttributes<HTMLDivElement | HTMLSpanElement>>;

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
    children: [ReactElement<TableHeaderProps$1<T>>, ReactElement<TableBodyProps$1<T>>];
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
    responsive?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
    /**
     * The currently selected row keys (controlled).
     */
    selectedKeys?: Selection;
    /**
     * The type of selection that is allowed.
     */
    selectionMode?: 'none' | 'single' | 'multiple';
    /**
     * Make table more compact by cutting all cell padding.
     */
    small?: boolean;
    /**
     * The current sort column and direction.
     */
    sortDescriptor?: SortDescriptor;
    /**
     * Add zebra-striping to table rows.
     */
    striped?: boolean;
}
declare const Table: {
    <T extends object>({ align, bordered, borderless, caption, children, className, color, disabledKeys, footer, hover, id, onSelectionChange, onSortChange, responsive, selectedKeys, selectionMode, small, sortDescriptor, striped, ...rest }: TableProps<T>): React__default.JSX.Element;
    displayName: string;
};

interface TableBodyProps<T> {
    /**
     * `TableRow` elements, or a render function paired with `items` for dynamic row generation.
     */
    children: ReactElement | ReactElement[] | ((item: T) => ReactElement);
    /**
     * A list of row data objects, rendered via the function form of `children`.
     */
    items?: Iterable<T>;
}
/**
 * Collection node, data-only — read by `Table` to build the table's row collection. Never
 * rendered directly.
 */
declare const TableBody: <T>(props: TableBodyProps<T>) => ReactElement;

interface TableCellProps {
    /**
     * The contents of the cell.
     */
    children: ReactNode;
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
}
/**
 * Collection node, data-only — see `TableHeader`. Read by `Table` to build a column in the
 * table's collection; never rendered directly.
 */
declare const TableColumn: (props: TableColumnProps) => ReactElement;

interface TableHeaderProps<T> {
    /**
     * `TableColumn` elements, or a render function paired with `columns` for dynamic column
     * generation.
     */
    children: ReactElement | ReactElement[] | ((column: T) => ReactElement);
    /**
     * A list of column data objects, rendered via the function form of `children`.
     */
    columns?: readonly T[];
}
/**
 * Collection node, data-only — read by `Table` to build the table's column collection. Never
 * rendered directly.
 */
declare const TableHeader: <T>(props: TableHeaderProps<T>) => ReactElement;

interface TableRowProps {
    /**
     * `TableCell` elements, or a render function called once per column with that column's key —
     * required when the row's parent `TableBody` uses the `items`/render-function form.
     */
    children: ReactElement | ReactElement[] | ((columnKey: Key$2) => ReactElement);
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

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    /**
     * A `TabsList` (containing `TabsTab` children) followed by one `TabsPanel` per tab.
     */
    children: ReactNode;
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * The initially selected tab's key (uncontrolled).
     */
    defaultSelectedKey?: Key;
    /**
     * The keys of tabs that cannot be selected, focused, or otherwise interacted with.
     */
    disabledKeys?: Iterable<Key>;
    /**
     * Whether tabs are selected automatically on arrow-key focus (`'automatic'`, the default) or
     * only on explicit activation — Enter/Space or click (`'manual'`).
     */
    keyboardActivation?: 'automatic' | 'manual';
    /**
     * Callback fired when the selected tab changes.
     */
    onSelectionChange?: (key: Key) => void;
    /**
     * The orientation of the tab list.
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * The selected tab's key (controlled).
     */
    selectedKey?: Key;
}
declare const Tabs: React__default.ForwardRefExoticComponent<TabsProps & React__default.RefAttributes<HTMLDivElement>>;

interface TabsTabProps {
    /**
     * Label content for the tab. Must be a plain string for the tab to participate in typeahead.
     */
    children: ReactNode;
    /**
     * Prevents the tab from being selected, focused, or otherwise interacted with.
     */
    disabled?: boolean;
    /**
     * Identifies this tab and pairs it with the `TabsPanel` of the same `id`.
     */
    id: Key;
}
declare const TabsTab: {
    (_props: TabsTabProps): null;
    displayName: string;
};

interface TabsListProps extends AriaAttributes {
    /**
     * `TabsTab` elements — read as data by `Tabs` to build the tab collection (see `Tabs.tsx`).
     * Not rendered directly.
     */
    children: ReactNode;
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Set the tab list variant to tabs or pills.
     */
    variant?: 'tabs' | 'pills';
}
declare const TabsList: {
    ({ className, variant, ...rest }: TabsListProps): React__default.JSX.Element;
    displayName: string;
};

interface TabsPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
    /**
     * Content of the panel, shown while the `TabsTab` of the same `id` is selected.
     */
    children: ReactNode;
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Pairs this panel with the `TabsTab` of the same `id`.
     */
    id: Key;
}
declare const TabsPanel: {
    ({ children, className, id, ...rest }: TabsPanelProps): React__default.JSX.Element | null;
    displayName: string;
};

interface TabContentProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const TabContent: React__default.ForwardRefExoticComponent<TabContentProps & React__default.RefAttributes<HTMLDivElement>>;

interface TabPaneProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
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
declare const TabPane: React__default.ForwardRefExoticComponent<TabPaneProps & React__default.RefAttributes<HTMLDivElement>>;

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
     * Sets the color of the component to one of Chassis context colors.
     */
    color?: ContextColor;
    /**
     * Delay hiding the toast (ms).
     */
    delay?: number;
    /**
     * Callback fired when the component requests to be closed.
     */
    onClose?: () => void;
    /**
     * Callback fired when the component requests to be shown.
     */
    onShow?: () => void;
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
declare const Toast: React__default.ForwardRefExoticComponent<ToastProps & React__default.RefAttributes<HTMLDivElement>>;

interface ToastBodyProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const ToastBody: React__default.ForwardRefExoticComponent<ToastBodyProps & React__default.RefAttributes<HTMLDivElement>>;

interface ToastCloseProps extends CloseButtonProps {
    /**
     * Component used for the root node. Either a string to use a HTML element or a component.
     */
    component?: string | ElementType;
}
declare const ToastClose: React__default.ForwardRefExoticComponent<ToastCloseProps & React__default.RefAttributes<HTMLButtonElement>>;

interface ToastFooterProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
}
declare const ToastFooter: React__default.ForwardRefExoticComponent<ToastFooterProps & React__default.RefAttributes<HTMLDivElement>>;

interface ToastHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Automatically add a close button to the header.
     */
    closeButton?: boolean;
}
declare const ToastHeader: React__default.ForwardRefExoticComponent<ToastHeaderProps & React__default.RefAttributes<HTMLDivElement>>;

interface ToasterProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * A string of all className you want applied to the base component.
     */
    className?: string;
    /**
     * Describes the placement of your component.
     *
     * @type 'top-start' | 'top' | 'top-end' | 'middle-start' | 'middle' | 'middle-end' | 'bottom-start' | 'bottom' | 'bottom-end' | string
     */
    placement?: 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end' | string;
}
declare const Toaster: React__default.ForwardRefExoticComponent<ToasterProps & React__default.RefAttributes<HTMLDivElement>>;

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

export { Accordion, AccordionBody, AccordionButton, AccordionCollapse, AccordionHeader, AccordionItem, Autocomplete, AutocompleteGroup, AutocompleteItem, Avatar, AvatarImage, AvatarStack, Backdrop, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, ButtonToolbar, Calendar, Card, CardBody, CardFooter, CardGroup, CardHeader, CardImage, CardImageOverlay, CardLink, CardSubtitle, CardText, CardTitle, Carousel, CarouselCaption, CarouselItem, Checkbox, CheckboxGroup, ChipInput, CloseButton, Col, Collapse, ColorInput, Combobox, ComboboxGroup, ComboboxItem, Container, DatePicker, DateRangePicker, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle, FileInput, FloatingInput, Form, FormFeedback, FormField, FormHelp, FormLabel, Icon, Image, InputAdorn, InputGroup, InputGroupAddon, Link, List, ListItem, Menu, MenuDivider, MenuHeader, MenuItem, MenuList, MenuSubmenu, MenuSubmenuBack, MenuText, MenuToggle, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Nav, NavItem, NavLink, NavTitle, Navbar, NavbarBrand, NavbarNav, NavbarText, NavbarToggler, Notification, NotificationHeading, NotificationLink, OtpInput, Pagination, PaginationItem, PasswordStrength, Placeholder, Popover, Progress, ProgressBar, Radio, RadioGroup, RangeCalendar, RangeInput, Row, Select, Spinner, Switch, TabContent, TabPane, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, TabsList, TabsPanel, TabsTab, TextInput, Textarea, Toast, ToastBody, ToastClose, ToastFooter, ToastHeader, Toaster, Tooltip, addToast, closeToast, toastQueue };
```
