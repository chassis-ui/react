import { Accordion } from './components/accordion'
import { Autocomplete } from './components/autocomplete'
import { Avatar } from './components/avatar'
import { Notification } from './components/notification'
import { Badge } from './components/badge'
import { Backdrop } from './components/backdrop'
import { Breadcrumb } from './components/breadcrumb'
import { Button } from './components/button'
import { ButtonGroup, ButtonToolbar } from './components/button-group'
import { CxCalendar } from './components/calendar/CxCalendar'
import { CxRangeCalendar } from './components/calendar/CxRangeCalendar'
import { Card } from './components/card'
import { Carousel } from './components/carousel'
import { Collapse } from './components/collapse'
import { CxChipInput } from './components/chip-input/CxChipInput'
import { CloseButton } from './components/close-button'
import { CxColorInput } from './components/color-input/CxColorInput'
import { CxFileInput } from './components/file-input/CxFileInput'
import { Combobox } from './components/combobox'
import { CxDatePicker } from './components/datepicker/CxDatePicker'
import { CxDateRangePicker } from './components/datepicker/CxDateRangePicker'
import { CxOtpInput } from './components/otp-input/CxOtpInput'
import { CxPasswordStrength } from './components/password-strength/CxPasswordStrength'
import { I18nProvider } from 'react-aria'
import { Menu } from './components/menu'
import { Col, Container, Row } from './components/grid'
import { CxCheckbox } from './components/checkbox/CxCheckbox'
import { CxCheckboxGroup } from './components/checkbox/CxCheckboxGroup'
import { CxForm } from './components/form/CxForm'
import { CxFloatingInput } from './components/floating-input/CxFloatingInput'
import { CxFormField } from './components/form-field/CxFormField'
import { CxFormFeedback } from './components/form/CxFormFeedback'
import { CxFormHelp } from './components/form/CxFormHelp'
import { CxFormLabel } from './components/form/CxFormLabel'
import { CxInputAddon } from './components/input-group/CxInputAddon'
import { CxInputGroup } from './components/input-group/CxInputGroup'
import { CxInputAdorn } from './components/input-adorn/CxInputAdorn'
import { CxRadio } from './components/radio/CxRadio'
import { CxRadioGroup } from './components/radio/CxRadioGroup'
import { CxRangeInput } from './components/range-input/CxRangeInput'
import { Select } from './components/select'
import { CxSwitch } from './components/switch/CxSwitch'
import { CxTextInput } from './components/text-input/CxTextInput'
import { CxTextarea } from './components/textarea/CxTextarea'
import { Icon } from './components/icon'
import { Image } from './components/image'
import { Link } from './components/link'
import { List } from './components/list'
import { Modal } from './components/modal'
import { Nav } from './components/nav'
import { Navbar } from './components/navbar'
import { Pagination } from './components/pagination'
import { Placeholder } from './components/placeholder'
import { Popover } from './components/popover'
import { Progress } from './components/progress'
import { Drawer } from './components/drawer'
import { Spinner } from './components/spinner'
import { CxTable } from './components/table/CxTable'
import { CxTableBody } from './components/table/CxTableBody'
import { CxTableCell } from './components/table/CxTableCell'
import { CxTableColumn } from './components/table/CxTableColumn'
import { CxTableHeader } from './components/table/CxTableHeader'
import { CxTableRow } from './components/table/CxTableRow'
import { Tabs, TabContent, TabPane } from './components/tabs'
import { Toast, Toaster, addToast, closeToast, toastQueue } from './components/toast'
import { Tooltip } from './components/tooltip'
// plop:import

export {
  // plop:export
  Accordion,
  Autocomplete,
  Avatar,
  Notification,
  Badge,
  Backdrop,
  Breadcrumb,
  Button,
  ButtonGroup,
  ButtonToolbar,
  CxCalendar,
  CxRangeCalendar,
  Card,
  Carousel,
  CxChipInput,
  CloseButton,
  Collapse,
  CxColorInput,
  Combobox,
  CxDatePicker,
  CxDateRangePicker,
  CxFileInput,
  // Re-exported (not a `Cx*` component): react-aria is a bundled dependency, not a peer, so its
  // module — including the `I18nProvider` context `CxDatePicker` reads locale from via
  // `useLocale()` — is inlined into this package's own build output, distinct from any react-aria
  // copy a consumer might separately install. A consumer's own `<I18nProvider>` would set a
  // *different* context instance and silently have no effect on `CxDatePicker`; this re-export is
  // the one that actually reaches it.
  I18nProvider,
  CxOtpInput,
  CxPasswordStrength,
  Menu,
  Col,
  Container,
  Row,
  CxCheckbox,
  CxCheckboxGroup,
  CxFloatingInput,
  CxForm,
  CxFormField,
  CxFormFeedback,
  CxFormHelp,
  CxFormLabel,
  Icon,
  Image,
  CxInputAddon,
  CxInputGroup,
  CxInputAdorn,
  Link,
  List,
  Modal,
  Nav,
  Navbar,
  Pagination,
  Placeholder,
  Popover,
  Progress,
  CxRadio,
  CxRadioGroup,
  CxRangeInput,
  Drawer,
  Select,
  Spinner,
  CxSwitch,
  CxTable,
  CxTableBody,
  CxTableCell,
  CxTableColumn,
  CxTableHeader,
  CxTableRow,
  Tabs,
  TabContent,
  TabPane,
  CxTextInput,
  CxTextarea,
  Toast,
  Toaster,
  addToast,
  closeToast,
  toastQueue,
  Tooltip
}
