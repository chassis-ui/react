---
"@chassis-ui/react": minor
---

`CardHeader`, `CardSubtitle`, `CardText`, and `CardTitle` now use the type-safe `PolymorphicComponentProps`/`PolymorphicRef` pattern instead of the old untyped `component?: string | ElementType`.

`CardBody`, `CardFooter`, `CardGroup`, and `CardImageOverlay` gain a new `component` prop (previously plain, unconfigurable `div` wrappers), using the same pattern. `CardImage` and `CardLink` are unchanged — `CardImage` already used the new pattern, and `CardLink` wraps the already-migrated `Link`.
