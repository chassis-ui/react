---
'@chassis-ui/react': patch
---

`I18nProviderProps` is exported beside `I18nProvider` (#118). A consumer wrapping the provider in one of their own had to type its props from react-aria's package, the copy the `I18nProvider` comment says not to use, since the one this package inlines is what `DatePicker` and the other fields read their locale from.
