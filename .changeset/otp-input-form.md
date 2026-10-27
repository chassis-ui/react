---
'@chassis-ui/react': patch
---

`OtpInput` takes `form` (#91), the id of a form elsewhere on the page: the boxes and the hidden `name` input join it, a submit of it carries the code and a reset of it puts the code back. The other fields already took it; this one typed `form` as an error and, cast through, put it on the group's `<div>`.
