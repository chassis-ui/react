---
"@chassis-ui/react": minor
---

`FormFeedback`, `FormHelp`, `NotificationText`, and `NotificationTitle` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`.

`Notification`'s `titleComponent` prop drops its redundant `string |` union member (`ElementType` already includes element-name strings) — a type-only cleanup surfaced while migrating the `NotificationTitle` it's passed through to; no behavior change.
