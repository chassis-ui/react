---
'@chassis-ui/react': patch
---

A `Modal`, `Drawer` or `Alert` stays open when a press that starts inside it is released over the backdrop (#122): selecting text in a field and letting go outside it, or dragging a crop handle past the dialog's edge. The browser fires the `click` of such a press on the nearest common ancestor of its two ends, the `<dialog>` itself, which was taken for a click on the backdrop and closed the dialog, or bounced it with `backdrop="static"`. Only a press that goes down and comes up on the backdrop closes or bounces it now, as in `@chassis-ui/css`'s own dialogs.
