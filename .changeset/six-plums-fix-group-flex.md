---
"@chassis-ui/react": patch
---

`RadioGroup`/`CheckboxGroup`'s horizontal-orientation wrapper now uses `Flex` instead of `Stack`, restoring the original `d-flex gap-medium` markup (an earlier phase of the Stack rollout had reached for `Stack` here since no general-purpose flex primitive existed yet, which silently changed the rendered class to `hstack gap-medium` and picked up `.hstack`'s `align-items: flex-start`/`flex: 1 1 auto` defaults). No prop changes.
