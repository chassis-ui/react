---
'@chassis-ui/react': patch
---

`<Switch type="radio">` renders a checkbox with `role="switch"`, which ARIA allows, instead of a radio input with that role, which failed axe's `aria-allowed-role`. It still behaves as one of a radio group: switches of the same `name` have one on at a time, a click leaves the one that is on, `required` asks for one of the group, and the form submits the `value` of the one that is on.
