---
'@chassis-ui/react': patch
---

`<DataGrid hover>` highlights body rows alone (#103). The hover rule matched every `[role="row"]`, the header row included, where `Table` hovers `tbody` rows only.
