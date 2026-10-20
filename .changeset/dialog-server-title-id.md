---
'@chassis-ui/react': patch
---

The server HTML of a `Modal` or `Drawer` no longer points `aria-labelledby` at an id it doesn't hold (#67). Before hydration every dialog was labelled by the id a title takes by default, whether a title rendered or not and whatever id it had, so a dialog with no title, or with `<ModalTitle id="...">`, shipped a dangling reference in every page, closed dialogs included. A dialog rendered with `open` is now labelled in its server HTML by the title found among its children, under the id that title renders (its own `id`, the `asChild` element's, or the generated one), and by none when it has no title; a closed dialog has no `aria-labelledby` until hydration. After hydration nothing changes: the dialog is labelled by the title that renders.
