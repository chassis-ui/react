---
'@chassis-ui/react': patch
---

`orientation="vertical"` of `Tabs` stacks the tabs. It set `aria-orientation` and the arrow keys only, so the list was announced as vertical, answered to the up and down keys, and was drawn as a row. The `TabList` now also gets the `flex-column` class. The panels stay below the list: lay out the root with `className`, for example `d-flex align-items-start gap-md`, to put them beside it.
