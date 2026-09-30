---
'@chassis-ui/react': minor
---

Every component that shows and hides takes its state under three props: `visible` is controlled,
`defaultVisible` is the initial state of an uncontrolled component, and `onVisibleChange(visible)`
reports each change the component asks for. `Popover`, `Tooltip`, `Menu`, `Modal`, `Drawer`,
`Toast`, `Notification`, `DatePicker` and `DateRangePicker` take all three, and a state setter fits
the callback as it is: `visible={open} onVisibleChange={setOpen}`.

Breaking: `visible` on `Popover`, `Tooltip`, `Menu`, `Toast` and `Notification` is now controlled.
It used to be copied into the component's own state whenever it changed, so the component still
opened and closed itself in between and a parent could not hold it closed. Now the component
shows and hides only when `visible` changes; its trigger, the Escape key, a click outside, a close
button and the `autohide` timer are requests, reported to `onVisibleChange`. TypeScript does not
flag the difference, so check each use:

- `visible` as the initial state (`<Popover visible>`, `<Toast visible autohide>`): use
  `defaultVisible`.
- `visible={open}` with `onShow` and `onHide` setting `open`: use `onVisibleChange={setOpen}`.
  `onShow` and `onHide` fire when the component has shown or hidden, which under `visible` happens
  only after the state changed.
- `<Toast visible={open} onClose={() => setOpen(false)}>`, and the same on `Notification`: use
  `onVisibleChange={setOpen}`. `onClose` fires after the toast has hidden.
- `<Tooltip visible onShow={...}>`: `onShow` no longer fires for a tooltip that is shown when it
  mounts, as it never did on `Popover` and `Menu`. It reports a change, and there was none.

In development, a request that is dropped because `visible` is set and there is no
`onVisibleChange` warns once. `Modal` and `Drawer` behave as before: `visible` with `onClose` is
still complete, and `defaultVisible` adds a dialog that is open at first and closes itself.
`Collapse` is unchanged and takes `visible` only.

Also in this release:

- `DatePicker` and `DateRangePicker` take `visible`, `defaultVisible` and `onVisibleChange`.
  `isOpen`, `defaultOpen` and `onOpenChange` still work, are deprecated, and warn in development.
- `Popover` and `Tooltip` pass every other attribute to their panel: `className`, `style`, `id`,
  `data-*`, event handlers. They forward a ref to it. They used to accept `aria-label` and
  `aria-labelledby` only (`Popover`) or nothing (`Tooltip`). A caller `id` is the one the trigger's
  `aria-controls` or `aria-describedby` points to.
- `MenuToggle`'s `variant` is typed as `Button`'s, so `variant="link"` is accepted (#38).
  Breaking: `variant="solid"` no longer type-checks, as on `Button`, where it is the look with no
  variant.
- `ToastContent`, the options of `addToast`, covers every `Toast` prop that `Toaster` passes on:
  `role`, `closeButton`, `closeLabel`, `message`, `title`, `icon`, `time` and `footer` are new
  (#39). `children` is optional, so a toast can be queued from the shorthand props alone.
