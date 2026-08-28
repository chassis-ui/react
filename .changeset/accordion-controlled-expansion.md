---
"@chassis-ui/react": minor
---

`Accordion` gains `expandedKeys`/`defaultExpandedKeys`/`onExpandedChange` for controlled/uncontrolled group-level expansion state with the `items` data-driven API, and `AccordionItemDef` gains a matching `onToggle`. Built entirely on native `<details>` `toggle` events, so exclusive `name` groups and `alwaysOpen` still behave exactly as the browser implements them.
