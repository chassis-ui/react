---
'@chassis-ui/react': patch
---

On Android, the first tap on a `ContextMenu` item after a long press now chooses it. The click that iOS emits when the finger lifts is swallowed so it doesn't land on the item that has just opened under it; Android emits `contextmenu` instead and no click, so the swallow stayed armed for a second and ate the user's real tap. A long press that the browser reports with `contextmenu`, or a cancelled pointer, now leaves nothing to swallow.
