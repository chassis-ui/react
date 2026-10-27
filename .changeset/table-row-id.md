---
'@chassis-ui/react': minor
---

`TableRow` takes an `id`, the row's key as it is given, as `DataGridRow` and `TreeItem` already do. A row's only key was React's `key`, which React makes a string, so with the docs' `key={row.id}` on rows whose ids are numbers, `selectedKeys={new Set([1])}` selected nothing, `disabledKeys={[2]}` disabled nothing and `onSelectionChange` reported `"1"`. Write `<TableRow id={row.id}>`: `id` wins over a `key` given beside it. The docs' examples now use it.
