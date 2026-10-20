---
'@chassis-ui/react': patch
---

Of two `Drawer`s mounted open in the same commit (two `defaultVisible` or `visible` drawers restored from the URL, say), only the last stays open (#68), as the docs promise of a second drawer that opens while one is open. Both stayed open before, two modal dialogs in the top layer at once, each holding a scroll lock: a drawer registered itself for the others to close only after the commit, by when both had already opened. The first now gets a close request (`onClose`, `onVisibleChange(false)`), as it does when the second opens later.
