---
'@chassis-ui/react': patch
---

A `Modal`, `Drawer` or `Alert` is no longer a stop of its own in the Tab order in Firefox and Safari, which take in a `<dialog>` without a tabindex and focus it with no ring. A `Navbar`'s `responsive` drawer shown inline was an invisible stop between the brand and the links, and a non-modal `Modal` or `Drawer` one before its first control. The dialog now renders `tabIndex={-1}`. A caller's `tabIndex` is kept, including when the dialog takes the focus on opening.
