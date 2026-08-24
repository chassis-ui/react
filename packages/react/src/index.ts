'use client'

// Side-effect only: installs the single document-level pointerdown listener that works around the
// browser's `:focus-visible` first-click heuristic misfire — see the module's own comment. Needs to
// run once wherever this package is used, not per-component, so it's imported here rather than
// from any individual component.
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
