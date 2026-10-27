---
'@chassis-ui/react': patch
---

A `Modal`, `Alert` or `Drawer` with `keyboard={false}` stays open however many times Escape is pressed. Chromium honours a prevented `cancel` once per user activation, so a second Escape in a row closed the dialog anyway. The Escape keydown of a modal dialog that keeps Escape out is now prevented too, which sends no `cancel` at all, and the dialog bounces as it does for the first press. An overlay open inside the dialog still takes the key first.
