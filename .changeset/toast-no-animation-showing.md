---
'@chassis-ui/react': patch
---

`<Toast animation={false}>` appears at once (#108). Without `fade` there is no transition to run, but the toast still went through the `showing` phase for the 50 ms fallback wait, and chassis-css paints `.toast.showing` at opacity 0 whether or not `.fade` is there: the toast was invisible for a tick and then popped in. It hides at once too, and `onClose` fires then.
