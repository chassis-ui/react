---
'@chassis-ui/react': minor
---

Declare `@chassis-ui/css` as a peer dependency (`>=0.5.0 <0.6.0`), so a mismatched version warns
at install instead of silently collapsing spacing after a token rename.

Breaking: `react` and `react-dom` narrow from `>=18` to `^19.0.0`. React 19 is the version the
package is tested on. On React 18, part of its own test suite and its type check fail.

The build now ships source maps with the original TypeScript embedded, so stack traces and
debuggers show the source instead of minified code. `src/` is no longer published, since the maps
carry it. Tarball: 565 files, 330.6 kB packed, 1,261 kB unpacked before; 356 files, 361.9 kB
packed, 1,391 kB unpacked after.
