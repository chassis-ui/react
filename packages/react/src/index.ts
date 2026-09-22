'use client'

// Side-effect only: installs the single document-level pointerdown listener that works around the
// browser's `:focus-visible` first-click heuristic misfire — see the module's own comment. Needs to
// run once wherever this package is used, not per-component, so it's imported by entry points
// (here, and every component folder's `index.ts` barrel, each of which is also a subpath entry)
// rather than from any individual component.
import './utils/suppressFocusRingGlobally'

import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from './components/accordion'
import { Autocomplete, AutocompleteGroup, AutocompleteItem } from './components/autocomplete'
import { Avatar, AvatarImage, AvatarStack } from './components/avatar'
import {
  Notification,
  NotificationTitle,
  NotificationIcon,
  NotificationText,
  NotificationStack,
  addNotification,
  closeNotification,
  notificationQueue
} from './components/notification'
import { Badge } from './components/badge'
import { Breadcrumb, BreadcrumbItem } from './components/breadcrumb'
import { Button } from './components/button'
import { ButtonGroup, ButtonToolbar } from './components/button-group'
import { Calendar, RangeCalendar } from './components/calendar'
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridColumn,
  DataGridHeader,
  DataGridRow,
  DataGridSelectAllCell,
  DataGridSelectionCell
} from './components/datagrid'
import {
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  CardImage,
  CardImageOverlay,
  CardLink,
  CardSubtitle,
  CardText,
  CardTitle
} from './components/card'
import {
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselIndicators,
  CarouselInner,
  CarouselItem,
  CarouselOverlay,
  CarouselPlayPause
} from './components/carousel'
import { Collapse } from './components/collapse'
import { ChipInput } from './components/chip-input'
import { CloseButton } from './components/close-button'
import { ColorInput } from './components/color-input'
import { FileInput } from './components/file-input'
import { Combobox, ComboboxGroup, ComboboxItem } from './components/combobox'
import { DatePicker, DateRangePicker } from './components/datepicker'
import { OtpInput } from './components/otp-input'
import { PasswordStrength } from './components/password-strength'
import { I18nProvider } from 'react-aria'
import {
  Menu,
  MenuDivider,
  MenuHeader,
  MenuItem,
  MenuList,
  MenuText,
  MenuToggle,
  MenuSubmenu,
  MenuSubmenuBack
} from './components/menu'
import { Col, Container, Grid, GridItem, Row } from './components/grid'
import { Checkbox, CheckboxGroup } from './components/checkbox'
import { Form, FormFeedback, FormHelp, FormLabel } from './components/form'
import { FloatingInput } from './components/floating-input'
import { FormField } from './components/form-field'
import { InputGroup, InputGroupAddon } from './components/input-group'
import { InputAdorn } from './components/input-adorn'
import { Radio, RadioGroup } from './components/radio'
import { RangeInput } from './components/range-input'
import { Select } from './components/select'
import { Switch } from './components/switch'
import { TextInput } from './components/text-input'
import { Textarea } from './components/textarea'
import { Icon } from './components/icon'
import { Placeholder } from './components/placeholder'
import { Link } from './components/link'
import { List, ListItem } from './components/list'
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from './components/modal'
import { Nav, NavItem, NavLink, NavTitle } from './components/nav'
import { Navbar, NavbarBrand, NavbarNav, NavbarText, NavbarToggler } from './components/navbar'
import { Pagination, PaginationItem } from './components/pagination'
import { Popover } from './components/popover'
import { Progress, ProgressBar } from './components/progress'
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from './components/drawer'
import { Skeleton, SkeletonLoader } from './components/skeleton'
import { Spinner } from './components/spinner'
import { Stepper, StepperItem } from './components/stepper'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from './components/table'
import { Tabs, Tab, TabList, TabPanel } from './components/tabs'
import {
  Toast,
  ToastBody,
  ToastFooter,
  ToastHeader,
  ToastIcon,
  Toaster,
  addToast,
  closeToast,
  toastQueue
} from './components/toast'
import { Tooltip } from './components/tooltip'
import { useDrawer, useModal, useNotification, usePagination, useToast } from './hooks'
import { Chip } from './components/chip'
import { Flex } from './components/flex'
import { Stack } from './components/stack'

export {
  Chip,
  Flex,
  Stack,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Autocomplete,
  AutocompleteGroup,
  AutocompleteItem,
  Avatar,
  AvatarImage,
  AvatarStack,
  Notification,
  NotificationTitle,
  NotificationIcon,
  NotificationText,
  NotificationStack,
  addNotification,
  closeNotification,
  notificationQueue,
  useNotification,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Calendar,
  RangeCalendar,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridColumn,
  DataGridHeader,
  DataGridRow,
  DataGridSelectAllCell,
  DataGridSelectionCell,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  CardImage,
  CardImageOverlay,
  CardLink,
  CardSubtitle,
  CardText,
  CardTitle,
  Carousel,
  CarouselControlNext,
  CarouselControlPrev,
  CarouselIndicators,
  CarouselInner,
  CarouselItem,
  CarouselOverlay,
  CarouselPlayPause,
  ChipInput,
  CloseButton,
  Collapse,
  ColorInput,
  Combobox,
  ComboboxGroup,
  ComboboxItem,
  DatePicker,
  DateRangePicker,
  FileInput,
  // Re-exported (not a component from this package): react-aria is a bundled dependency, not a
  // peer, so its module — including the `I18nProvider` context `DatePicker` reads locale from via
  // `useLocale()` — is inlined into this package's own build output, distinct from any react-aria
  // copy a consumer might separately install. A consumer's own `<I18nProvider>` would set a
  // *different* context instance and silently have no effect on `DatePicker`; this re-export is
  // the one that actually reaches it.
  I18nProvider,
  OtpInput,
  PasswordStrength,
  Menu,
  MenuDivider,
  MenuHeader,
  MenuItem,
  MenuList,
  MenuText,
  MenuToggle,
  MenuSubmenu,
  MenuSubmenuBack,
  Col,
  Container,
  Grid,
  GridItem,
  Row,
  Checkbox,
  CheckboxGroup,
  FloatingInput,
  Form,
  FormField,
  FormFeedback,
  FormHelp,
  FormLabel,
  Icon,
  Placeholder,
  InputGroup,
  InputGroupAddon,
  InputAdorn,
  Link,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  useModal,
  Nav,
  NavItem,
  NavLink,
  NavTitle,
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarText,
  NavbarToggler,
  Pagination,
  PaginationItem,
  usePagination,
  Popover,
  Progress,
  ProgressBar,
  Radio,
  RadioGroup,
  RangeInput,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  useDrawer,
  Select,
  Skeleton,
  SkeletonLoader,
  Spinner,
  Stepper,
  StepperItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TextInput,
  Textarea,
  Toast,
  ToastBody,
  ToastFooter,
  ToastHeader,
  ToastIcon,
  Toaster,
  addToast,
  closeToast,
  toastQueue,
  useToast,
  Tooltip
}

// Type-only public surface. Kept as `export type ... from` re-exports (the same shape
// `src/hooks/index.ts` uses) rather than the import-then-name-in-the-export-block pattern the
// value exports above follow — 164 type names would otherwise need 164 more import lines for no
// added clarity. Every component folder's barrel already exports its own prop types; this block
// is what actually makes them reachable as `@chassis-ui/react` imports, so a consumer can write
// `interface MyButtonProps extends ButtonProps` instead of re-deriving it with
// `ComponentProps<typeof Button>`.
export type {
  AccordionBodyProps,
  AccordionHeaderProps,
  AccordionItemDef,
  AccordionItemProps,
  AccordionProps
} from './components/accordion'
export type {
  AutocompleteGroupProps,
  AutocompleteItemProps,
  AutocompleteProps
} from './components/autocomplete'
export type {
  AvatarImageProps,
  AvatarProps,
  AvatarStackItemDef,
  AvatarStackProps
} from './components/avatar'
export type { BadgeProps } from './components/badge'
export type {
  BreadcrumbItemDef,
  BreadcrumbItemProps,
  BreadcrumbProps
} from './components/breadcrumb'
export type { ButtonProps } from './components/button'
export type { ButtonGroupProps, ButtonToolbarProps } from './components/button-group'
export type {
  CalendarLabels,
  CalendarMultipleProps,
  CalendarProps,
  CalendarSingleProps,
  DateRangePreset,
  RangeCalendarProps
} from './components/calendar'
export type {
  CardBodyProps,
  CardFooterProps,
  CardGroupProps,
  CardHeaderProps,
  CardImageOverlayProps,
  CardImageProps,
  CardLinkProps,
  CardProps,
  CardSubtitleProps,
  CardTextProps,
  CardTitleProps
} from './components/card'
export type {
  CarouselControlNextProps,
  CarouselControlPrevProps,
  CarouselEnds,
  CarouselIndicatorsProps,
  CarouselInnerProps,
  CarouselItemProps,
  CarouselOverlayProps,
  CarouselPlayPauseProps,
  CarouselProps,
  CarouselSlideDetail,
  CarouselTransition
} from './components/carousel'
export type { ButtonObject, CheckboxGroupProps, CheckboxProps } from './components/checkbox'
export type { ChipProps } from './components/chip'
export type { ChipInputProps } from './components/chip-input'
export type { CloseButtonProps } from './components/close-button'
export type { CollapseProps } from './components/collapse'
export type { ColorInputProps } from './components/color-input'
export type { ComboboxGroupProps, ComboboxItemProps, ComboboxProps } from './components/combobox'
export type {
  DataGridBodyProps,
  DataGridCellProps,
  DataGridColumnProps,
  DataGridHeaderProps,
  DataGridProps,
  DataGridRowProps,
  DataGridSelectionCellProps
} from './components/datagrid'
export type {
  DatePickerMultipleProps,
  DatePickerProps,
  DatePickerSingleProps,
  DateRangePickerProps
} from './components/datepicker'
export type {
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerProps,
  DrawerTitleProps
} from './components/drawer'
export type { FileInputProps } from './components/file-input'
export type { FlexProps } from './components/flex'
export type { FloatingInputProps } from './components/floating-input'
export type { FormFeedbackProps, FormHelpProps, FormLabelProps, FormProps } from './components/form'
export type { FormFieldProps } from './components/form-field'
export type {
  ColProps,
  ContainerProps,
  GridItemLayout,
  GridItemProps,
  GridProps,
  RowProps
} from './components/grid'
export type { IconProps } from './components/icon'
export type { InputAdornProps } from './components/input-adorn'
export type { InputGroupAddonProps, InputGroupProps } from './components/input-group'
export type { LinkProps } from './components/link'
export type { ListItemDef, ListItemProps, ListProps } from './components/list'
export type {
  MenuAutoClose,
  MenuDividerDef,
  MenuDividerProps,
  MenuFocusStrategy,
  MenuHeaderDef,
  MenuHeaderProps,
  MenuItemDef,
  MenuItemProps,
  MenuItemsDef,
  MenuListProps,
  MenuProps,
  MenuSubmenuBackProps,
  MenuSubmenuProps,
  MenuTextProps,
  MenuToggleProps
} from './components/menu'
export type {
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
  ModalTitleProps
} from './components/modal'
export type { NavItemDef, NavLinkProps, NavProps, NavTitleProps } from './components/nav'
export type {
  NavbarBrandProps,
  NavbarNavProps,
  NavbarProps,
  NavbarTextProps,
  NavbarTogglerProps
} from './components/navbar'
export type {
  NotificationContent,
  NotificationIconProps,
  NotificationProps,
  NotificationStackProps,
  NotificationTextProps,
  NotificationTitleProps
} from './components/notification'
export type { OtpInputProps } from './components/otp-input'
export type { PaginationItemProps, PaginationProps } from './components/pagination'
export type { PasswordStrengthProps } from './components/password-strength'
export type { PlaceholderProps } from './components/placeholder'
export type { PopoverProps } from './components/popover'
export type { ProgressBarProps, ProgressProps } from './components/progress'
export type { RadioGroupProps, RadioProps } from './components/radio'
export type { RangeInputProps } from './components/range-input'
export type { SelectOptionDef, SelectProps } from './components/select'
export type { SkeletonLoaderProps, SkeletonProps } from './components/skeleton'
export type { SpinnerProps } from './components/spinner'
export type { StackProps } from './components/stack'
export type { StepperItemDef, StepperItemProps, StepperProps } from './components/stepper'
export type { SwitchProps } from './components/switch'
export type {
  TableBodyProps,
  TableCellProps,
  TableColumnProps,
  TableHeaderProps,
  TableProps,
  TableRowProps
} from './components/table'
export type { TabListProps, TabPanelProps, TabProps, TabsProps } from './components/tabs'
export type { TextInputProps } from './components/text-input'
export type { TextareaProps } from './components/textarea'
export type {
  ToastBodyProps,
  ToastContent,
  ToastFooterProps,
  ToastHeaderProps,
  ToastIconProps,
  ToastProps,
  ToasterProps
} from './components/toast'
export type { TooltipProps } from './components/tooltip'

// Cross-cutting types that aren't owned by any one component folder: the scales and vocabularies
// the prop types above are built from. `types.ts`'s `FontFamily`/`FontWeight`/`FontSize`/
// `Placements`/`TextColor`/`Triggers` are deliberately not re-exported — nothing in this package
// references them, so publishing them would commit this package's public API to types it doesn't
// actually use.
export type {
  Breakpoint,
  ContextColor,
  ContextStyle,
  ExtendedSizing,
  Shapes,
  Sizing,
  Spacing
} from './types'
// Backs the `placement` prop on `Menu`/`MenuSubmenu`/`Popover`/`Tooltip`. Lives in `utils/`
// rather than a component barrel because all four share it.
export type { Placement } from './utils/overlayPlacement'
// Result types for the five hooks exported as values above. Mirrors what `hooks/index.ts` itself
// exposes for them — the other hooks in that folder stay internal, so their types do too.
export type {
  UseDrawerResult,
  UseModalResult,
  UseNotificationResult,
  UsePaginationResult,
  UseToastResult
} from './hooks'
