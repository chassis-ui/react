---
'@chassis-ui/react': patch
---

`ButtonGroup vertical` stacks its buttons. It rendered `button-group vertical`, a pair of classes
`@chassis-ui/css` has no rule for, so the group stayed a row; it renders `button-group-vertical`
now, the class of the framework, in place of `button-group`. `size` has no effect on a vertical
group, as in the framework: size its buttons themselves.

`RadioGroup` and `CheckboxGroup` with `orientation="horizontal"` wrap their items onto further
lines when the container is too narrow for one. They overflowed it.
