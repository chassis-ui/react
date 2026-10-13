---
'@chassis-ui/react': patch
---

A pressed link or button no longer gets an inline `outline` style. The library's document-level listener set `style="outline: none"` (`outline: medium` in Safari) on every focusable element at `pointerdown` and took it back on blur, on any element of the page, the library's own or not. In Safari, where a clicked button takes no focus and so never blurs, the style stayed for good and the button showed no focus ring when reached by keyboard later; in the other browsers it hid the ring a key press brings back to a clicked element.

The outline is now suppressed only where a press would show a keyboard ring: on the pressed element when it takes focus and matches `:focus-visible`, which happens where react-aria focuses by script as the press starts (a `MenuToggle`, a calendar date). It is restored on blur or at the next key press, and an element that had no `style` attribute is left without one.
