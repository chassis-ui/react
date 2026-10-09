---
'@chassis-ui/react': patch
---

A Tailwind build of `@chassis-ui/css` no longer loses the color and alignment classes of seven components. They built the class name from the prop at runtime (`` `bg-${color}` ``), which Tailwind's scanner cannot read, so the class rendered with no rule and nothing warned. Each prop now maps to whole class names:

- `color` of `ProgressBar` and `Skeleton` (`bg-*`), of `Spinner` (`fg-*`), of `AlertIcon` (`icon-*`) and of `Link` (`link-*`);
- `align` of `Placeholder` (`float-start`, `float-end`), of `Pagination` (`justify-content-*`), and of `Table`, `StaticTable` and `DataGrid` (`align-top`, `align-middle`, `align-bottom`).

The markup of every value the props accept is the same as before. A value outside a prop's type, which rendered a class named after it, now renders none.

Tailwind does not scan `node_modules`, so a Tailwind build has to register this package for the whole class names to be found: `@source "../node_modules/@chassis-ui/react/dist";` in the project's stylesheet, with the path from that file. The regular build of `@chassis-ui/css` needs nothing: it ships every class.
