---
'@chassis-ui/react': patch
---

`Table`, `DataGrid` and `Tree` with `selectionMode="single"` now hold one selected key at most. A selection of several, kept from `selectionMode="multiple"` or passed with `"single"`, stayed selected in full and was never reported; the first key now stays, and `onSelectionChange` reports the trimmed selection once.
