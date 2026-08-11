---
"@chassis-ui/react": major
---

**Breaking:** `Toast`'s `image` prop is replaced by `icon`, matching `Notification`'s pattern — a string renders `<ToastIcon name={icon} />`, any other node renders as-is. `ToastHeader` gets the same `icon` prop in place of `image`, and its `title` prop is removed: the heading is now just `ToastHeader`'s `children`, wrapped in the same `<strong>` markup automatically.

```diff
- <Toast image={logo} title="Chassis" time="7 min ago" />
+ <Toast icon={logo} title="Chassis" time="7 min ago" />

- <ToastHeader closeButton>
-   {logo}
-   <strong className="me-auto">Chassis</strong>
-   <small>7 min ago</small>
- </ToastHeader>
+ <ToastHeader icon={logo} time="7 min ago" closeButton>
+   Chassis
+ </ToastHeader>
```

`Toast`'s own `icon`/`title`/`time` shorthand props are unaffected by the `ToastHeader` change — they still compose an internal `ToastHeader` for you. A new `ToastIcon` component is exported, mirroring `NotificationIcon`.
