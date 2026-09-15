---
'@chassis-ui/react': patch
---

Stop dev-time misuse warnings from firing in production, and fix arrow-key direction under RTL.

- Every `console.warn`/`console.error` in the package now goes through `devWarning`/`devError`,
  guarded on `process.env.NODE_ENV`. Nothing is logged in a consumer's production build. They're
  also de-duplicated on the message: `AccordionItem`, `Carousel`, `FormField`, `Select` and
  `FloatingInput` warned from a render body, so a warning re-fired on every render and twice per
  render under StrictMode.
- `OtpInput`'s and `ChipInput`'s Arrow key handling now mirrors under `dir="rtl"`, matching what
  `Carousel` and `MenuSubmenu` already did. Arrow keys move by visual direction, so in an RTL field
  ArrowLeft moves *forward* through the boxes; previously the LTR mapping was hardcoded and sent an
  RTL user backwards.
