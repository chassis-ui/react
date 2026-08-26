---
"@chassis-ui/react": patch
---

Internal refactor: `Popover` and `Tooltip` now share their portal-container resolution, `visible`-prop sync, `onShow`/`onHide` firing, dialog-close reset, arrow-recentering style, and fade-transition class logic via a new internal `useFloatingOverlay` hook (`src/hooks/useFloatingOverlay.ts`). No public API or behavior change.
