---
'@chassis-ui/react': patch
---

Choosing a `Menu` item with the mouse no longer leaves a focus ring on the `MenuToggle`. Focus still returns to the toggle, so it doesn't fall to the page from the closed list, but without the ring, which comes back with the next key press. A choice made with Enter or Space, and Escape, return focus with the ring as before. The browser decides whether focus moved by script shows a ring from what was focused before, so the ring used to appear only sometimes.
