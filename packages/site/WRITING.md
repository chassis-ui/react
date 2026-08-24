# Documentation Style Guide

How to write component and concept docs for this library's documentation site. This guide codifies
voice, structure, and formatting conventions so contributors and reviewers have one place to
reference. It covers prose and content conventions only — site mechanics (shortcodes, generated
content, build tooling) live in this package's [`AGENTS.md`](AGENTS.md).

## How this guide is organized

- **Language (§1–5)** — voice, tone, and how to reference code in prose.
- **Structure (§6–10)** — frontmatter, section order, headings, and the closing API section.
- **Components and conventions (§11–16)** — live examples, callouts, accessibility, the Scope
  section, cross-references, and JSX formatting inside examples.
- **Code blocks and doc length (§17–20)** — language tags, partial vs full code, when to split a doc.
- **Lint checklist** — what to verify before opening a PR.

---

## Language

### 1. Voice by doc type

The right prose voice depends on what kind of doc it is, not which folder it lives in.

| Doc is...                                                                                                                       | Voice       | Second-person `you/your` | First-person `we/our` |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------ | --------------------- |
| A component reference doc (ends in an API section listing that component's props)                                               | Instructive | ✗ Avoid                  | ✗ Avoid               |
| A conceptual or walkthrough doc (getting started, layout guidance, patterns, cross-cutting overviews with no props to document) | Tutorial    | ✓ Appropriate            | ✗ Avoid               |

The test for "is this a component doc" is mechanical: does it end in a props reference section? If
yes, it's documenting a specific component's behavior and props — instructive voice. If a doc
describes a technique spanning several components without introducing its own props table, it's
closer to a guide than a reference page, and tutorial voice fits.

---

**Instructive voice** avoids `you`, `your`, `yours`, `we`, `our`, `ours`, and `us` in prose. The
reader is consulting the doc to understand a component's behavior and props, not following a
guided procedure; a narrator removes focus from the component itself.

**Why:** removing the implicit narrator keeps prose focused on what the component does, and reads
as reference documentation rather than a walkthrough.

**Good:**

> Focus moves to the panel on open — to a specific element if one is designated, otherwise to the
> panel itself. After the panel closes, focus returns to whichever element was focused when it
> opened.

**Bad:**

> When you open the panel, we move your focus into it automatically.

**Imperative vs descriptive.** Both are correct instructive voice; pick by what the sentence does.

- **Imperative** ("Set a size prop to render a larger control", "Pass an id to wire a label to a
  control that doesn't own one") describes what the reader does. Use for configuration and setup.
- **Descriptive** ("The control renders feedback text only alongside a truthy invalid state")
  describes what the component does in response. Use for behavior and side effects.

A typical paragraph mixes both — imperative for the prop to set, descriptive for the resulting
behavior.

**Exceptions:**

- Callouts may use imperative voice ("Provide an accessible name via the appropriate ARIA
  attribute") since they're direct guidance to the implementer.
- JSX prop values, code comments, and ARIA labels inside example markup are not prose and are
  unaffected.

---

**Tutorial voice** allows second-person "you"/"your" — they read naturally in a walkthrough or a
"here's how to combine these pieces" guide. First-person plural ("we"/"our") is still discouraged
everywhere, including tutorial docs — there's always a clearer alternative ("the previous step"
instead of "what we installed").

**Good:**

> Add the styling package alongside the component library — components apply utility class names
> but don't ship their own styles.

**Older docs don't fully follow this yet.** Some carry over "you/we" phrasing inherited from
earlier source copy. That's legacy, not the target — match the table above for new prose and for
paragraphs you're editing anyway; don't send a PR whose only change is an unrelated voice pass on a
section you weren't otherwise touching.

### 2. Every heading earns its paragraph

Every heading must be followed by at least one explanatory sentence before any live example, props
table, table, or bullet list. The paragraph names what the section is about and why it matters.

**Floor:** one full sentence is enough. Don't pad to a paragraph if a sentence does the job.

**Why:** a bare heading immediately followed by a live example tells the reader _what_ exists but
not _when to reach for it_.

**Good:**

```mdx
## Masked

Set a masked prop to render entered digits as dots — useful for PIN-style inputs where the value
shouldn't be visible on screen.

<Example>
  ...
</Example>
```

**Bad:**

```mdx
## Masked

<Example>
  ...
</Example>
```

**Exception:** the API section may go directly into its first sub-heading + props table pair
without an intro paragraph — the pairing is self-documenting. An Accessibility or Scope section
still needs its normal intro sentence, since those are prose sections, not tables.

**Anti-pattern: container phrases.** Intro sentences starting with "The following…", "Below is…",
or "Here you will find…" announce content without describing it.

**Bad:** "The following table lists the available sizes."

**Good:** "This component accepts three optional sizes, each capping the container's max-width at
a fixed breakpoint."

### 3. Describe behavior, not benefits

Docs explain how a component works, not why it's great. Skip "powerful", "flexible", "seamless",
"best-in-class". State what the prop does and let the behavior demonstrate the value.

**Good:** "Below a given breakpoint, the component renders as a slide-in panel; above it, inline."

**Bad:** "Our incredibly flexible component adapts beautifully to any screen size."

**Exception:** the frontmatter `description` field (used as the docs meta description) may include
a light positioning phrase and concrete use-case list, e.g. _"Visualize multi-step processes —
suitable for wizards, timelines, and sign-up flows."_ Keep it accurate to what the component does;
avoid superlatives.

### 4. Active voice over passive where natural

**Good:** "The component sets a state attribute on the root element when it opens."

**Bad (when avoidable):** "A state attribute is set on the root element by the component when it
is opened."

### 5. Code references in prose

- Component names: backticks with angle brackets for JSX usage, backticks alone when referring to
  the identifier.
- Props: backticks, with the value if relevant.
- Prop types: backticks.
- Generated class names (when referenced directly, e.g. explaining what a component renders):
  backticks with leading dot.
- Custom properties: backticks, full name.
- Hooks: backticks with parens.
- File paths: backticks, relative to repo root.
- HTML elements: backticks with angle brackets.
- Attributes: backticks, with value if relevant.

In file:line references in review comments or commit messages, use the Markdown link form so the
path is clickable.

---

## Structure

### 6. Frontmatter

Every doc starts with YAML frontmatter, validated against the site's content schema. Required in
practice:

```yaml
---
title: Component Name
description: One-sentence summary, instructive voice, under 160 characters.
toc: true
---
```

The schema accepts several more fields, none of which most docs actually set — use them when they
genuinely apply rather than treating the list below as boilerplate to fill in:

| Field       | Shape                                       | Effect                                                                                        |
| ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `added`     | `{ version: string, show_badge?: boolean }` | Records when the component/prop set shipped; `show_badge` renders an "Added in vX" indicator. |
| `deps`      | `{ title: string, url?: string }[]`         | Lists sibling components this one composes with.                                              |
| `direction` | `'rtl'`                                     | Flags a doc as covering right-to-left-specific behavior.                                      |
| `aliases`   | `string \| string[]`                        | Redirects from old slugs after a page rename.                                                 |
| `mdn`       | `string`                                    | Link to the relevant MDN reference for the underlying native element/API.                     |
| `thumbnail` | `string`                                    | Social/preview card image.                                                                    |

**Good `description`:**

> Input and textarea components. Give textual form controls an upgrade with custom styles, sizing,
> focus states, and more.

**Bad `description`:**

> The best text input you'll ever use! Amazing styling, incredible flexibility.

### 7. Section order

Docs are organized around what the component actually needs — opener headings like "About",
"Overview", "How it works", or "Data-driven usage" all legitimately open different docs depending
on whether the component needs conceptual framing before its first example. What _is_ consistent
across nearly every doc, and worth treating as the fixed points:

```
[Opener]                      (optional — see naming note below; skip it if the component needs no framing before its first example)
[Basic usage example(s)]
[Variant sections]            (see note below — promoted here ONLY for variant-centric components)
[Additional usage/behavior sections — however many the component needs, in whatever order reads best]
[Accessibility]               (rare — only for genuinely nontrivial a11y behavior, see §13)
[Scope]                       (rare — only for a deliberate, non-obvious limitation, see §13a)
## API                        (always present, always last)
   ### <Component>
   ### <SubComponent>         (one per exported component in the family)
```

Only `## API` is a fixed, always-present heading. Everything above it is shaped by what the
component actually needs — don't pad a simple component with sections it has nothing to say in.

**Opener naming.** "About", "Overview", "Approach", "Examples", and "How it works" all show up as
first-or-near-first headings — inconsistent naming for the same job. Going forward, prefer:

- `## Overview` when the section frames a concept before any example — composition model, when to
  reach for this component vs. a sibling.
- `## Examples` when the doc just needs to get to a live demo, optionally with `###` subsections
  per scenario.

Migrate other opener names to `## Overview` opportunistically; don't gate an unrelated PR on the
rename.

**Variant promotion.** For variant-centric components — where the variants ARE the primary usage
surface (a color or severity indicator, an avatar, a toast-style notification, and similar) —
promote color/size/style variant sections to immediately after the basic usage example, ahead of
any layout/placement/behavior sections. For everything else — components with real internal
structure (a table, a modal-style overlay, a collapsible nav) — variant/dark-mode sections stay
mid-document or late, after the reader understands the component's structure. Don't reach for a
dedicated `## Theming` heading — dark mode and context variants are usage variants, and read better
as one more `##`/`###` alongside the others than as a separate ceremony.

**`## Accessibility` is the canonical name** for that section when a component needs one at all —
not "Regarding accessibility" or other phrasing.

Conceptual docs (getting-started, layout, patterns, and cross-cutting overview guides from §1) use
looser structure and tutorial voice, but still lead with an introductory paragraph.

### 8. Heading hierarchy

Don't skip levels. `##` → `###` → `####`, never `##` → `####`. Three levels of nesting under one
`##` usually signals a section that wants to be its own sibling `##`.

### 9. Heading length, case, and punctuation

**Length.** Keep `##`/`###` headings under **~25 characters** — the shared sidebar table-of-contents
column wraps longer titles to a second line, which makes the ToC hard to scan.

**Good:** `Color variants` (14 chars), `Static backdrop` (16 chars), `Optional sizes` (14 chars)

**Bad:** `Configuring the toggle button for collapsed states` (50 chars) — split into a parent
heading + sub-heading, or shorten and push detail into the intro paragraph.

**Sentence case.** `### Color variants`, not `### Color Variants`.

**No trailing punctuation.** Headings don't end in `.`, `:`, `?`, or `!`.

**Component title pluralization.** Component doc titles are singular, even for docs that catalog
several variants of the component. Don't pluralize just because a doc is variant-centric.

### 10. The `## API` section template

`## API` is the closing reference section, generated from the component's real TypeScript props
(see this package's [`AGENTS.md`](AGENTS.md) for the generation step). The template:

```mdx
## API

### <Component>

<PropTable component="<Component>" />
### <SubComponent>

<PropTable component="<SubComponent>" />
```

**Multiple sub-components.** List one heading + props-table pair per exported component in the
family, ordered to match how a reader composes them — usually parent-first, then children in the
order they're introduced in the prose above, not alphabetically. A flat family of equally-weighted
sibling components can read fine alphabetically; a family with real nesting (components that wrap
each other) should follow that nesting order instead.

**No hand-written prop tables.** Never transcribe props into a Markdown table by hand — always use
the generated props-table shortcode. If a prop is missing or stale, the fix is regenerating the
underlying data after the component's exported props change (see [`AGENTS.md`](AGENTS.md)), not a
manual table.

**No `### Custom properties` / `### Sass variables` / `### Sass mixins` sections.** Component
styling here is class-based, not something this package owns source for. If a doc needs to
reference the underlying CSS custom properties a component reads (rare — most styling is
class-based, not CSS-variable-based, at this layer), link out to the sibling CSS framework's docs
via the internal doc-reference syntax (see §15) rather than adding a Sass reference here.

---

## Components and conventions

### 11. Live examples over static code

Usage examples render live, with the displayed source snippet auto-derived from the live markup
rather than passed in as a separate code string — never hand-transcribe a second copy of the
markup next to the live example.

Three authoring patterns, depending on whether the example needs interactivity:

- **Static, inline** — the example needs no state. Write the markup directly as the example's
  children; the source shown below the preview is sliced verbatim from it.
- **Interactive, extracted to its own file** — the example needs local state, event handlers, or
  any hook. Write it as a small standalone component and hydrate it explicitly at render time
  (without the hydration directive the demo renders but never becomes interactive). The displayed
  source is the referenced file's content, verbatim — write these files as documentation-quality
  samples, not scratch demos, since the raw file is what readers see.
- **Source override** — when the live-rendered markup needs a tweak that shouldn't appear in the
  printed source (e.g. forcing a surface open or disabling a dismiss behavior so it stays visible
  for a static screenshot instead of behaving like a real dismissible surface), pass the "real"
  usage example as a literal override string; the preview still renders the live children above
  it.

An inherited resizable-example wrapper exists but is currently unused anywhere in this doc set. If
a component's responsive behavior is driven by container queries rather than viewport media
queries, it may be the right fit — check whether the underlying class switches layout via a
container query before reaching for it, and mention the resize affordance in the intro sentence
when you use it. Since no doc uses it yet, treat this as a judgment call rather than an established
pattern.

### 12. Callouts

The callout shortcode takes a **`type`** prop — `'info' | 'warning' | 'danger'`, defaulting to
`'info'` — and an optional `name` to render a shared callout from a shared content folder.

```mdx
<Callout type="warning">
  When the controlled element precedes its toggle in document order, move focus to it
  programmatically on open — otherwise keyboard users may not discover it.
</Callout>
```

**Watch for a `context` prop.** Most components in this library use a `context` prop for their own
color/severity variant, and it's an easy mistake to reach for on a callout instead of `type` — but
the callout shortcode doesn't declare `context` and doesn't forward extra attributes, so it's
silently dropped and the callout renders as the default `info` style regardless of the intended
severity. Always use `type`.

Types and intent:

- **`type="info"`** — context the reader benefits from but doesn't strictly need. Tips,
  alternatives, related patterns.
- **`type="warning"`** — gotchas that cause real problems if ignored: accessibility failures,
  focus-management footguns, browser quirks.
- **`type="danger"`** — for genuinely breaking issues, more severe than a warning.

### 13. Accessibility patterns

Most components need **no dedicated `## Accessibility` section at all.** Components built on a
well-supported interaction primitive or a native element get correct ARIA semantics, keyboard
handling, and focus behavior for free from that foundation — that's the point of building on them.
A purely visual or presentational component has nothing accessibility-specific to say beyond what
its example markup already shows. Writing a section anyway, just to have one, adds noise without
adding information.

Every example should still carry the ARIA attributes appropriate to its semantic role, inline in
the markup rather than called out separately, e.g.:

- **Current page in nav:** an `aria-current="page"`-style attribute on the active link.
- **Toggle controls:** `aria-controls`, `aria-expanded` — components that manage this themselves
  keep it in sync; document that explicitly rather than showing it as something the caller must
  set by hand.
- **Dialog-style surfaces:** `aria-labelledby` pointing at the title element's `id`.
- **Visually-hidden helper text:** a screen-reader-only utility class for context that shouldn't
  render visually.

**When a component genuinely warrants its own `## Accessibility` section** — the exception, not the
norm: implicit live-region semantics (`role="status"`, `aria-live`), focus management (traps,
restoration, programmatic focus moves), nontrivial keyboard interaction beyond a single
Enter/Space activation, or ARIA state synchronization that isn't obvious from the prop names alone.
The bar is behavior a reader can't infer just by looking at the props. Position it right before
`## Scope`/`## API` per §7.

### 13a. The `## Scope` section

An optional section, positioned right before `## API`, that documents what the component
**intentionally doesn't do** — either because the underlying implementation doesn't support it, or
because it's deferred rather than bundled into the first pass.

Use it when a reader familiar with a peer library's equivalent component would reasonably ask "does
this also do X?" and the honest answer is no. This is different from a limitation buried in an
issue tracker — it belongs in the doc because it changes how someone decides whether the component
fits their use case.

**Good:**

> **No virtualization.** Every row renders directly — there's no windowing for very large
> datasets. Most large datasets are better served by server-side pagination anyway.

### 14. No "JavaScript API" section

Component behavior is expressed entirely through props, callbacks, and (occasionally) hooks —
there's no separate JS plugin to instantiate, and no doc should have a "JavaScript API"-shaped
section. Document callback props (`onOpen`, `onClose`, `onComplete`, etc.) inline in the relevant
behavior section instead, and let the props table under `## API` carry the full signature.

### 15. Cross-references

**Within this doc set.** Use the internal doc-reference link syntax inside Markdown link syntax —
the build resolves it at compile time, with the path relative to the docs root.

**To a sibling framework's docs.** When this library and a sibling framework are separate sites,
the internal doc-reference syntax only resolves within the current site — link to the sibling
site's docs with a plain absolute URL instead.

**Within the same doc.** Plain `#anchor` links; anchor IDs are slugified from heading text
(lowercase, spaces to hyphens, punctuation stripped). Don't create duplicate heading text/slugs in
one doc; re-verify anchors after renaming a heading.

**External references.** Standard Markdown links; prefer MDN (frontmatter also has a dedicated
`mdn` field, §6) and WAI-ARIA APG over blog posts.

**Component source.** Link to the source file with an optional `:line`, using the Markdown link
form so the reference is clickable.

### 16. JSX formatting in examples

- **Indentation:** 2 spaces, matching the surrounding MDX.
- **Attribute ordering:** structural/identity props first (`type`, `id`), then `className`, then
  state props (`disabled`, `invalid`, `readOnly`).
- **Class name ordering inside `className`:** base → layout modifier → state, e.g.
  `className="nav-link active"` not `className="active nav-link"`.
- **Self-closing elements:** JSX requires it — `<br/>` and similar — this isn't optional the way
  it is in HTML.
- **Comments inside examples:** JSX comments, `{/* body */}`, not HTML comments (`<!-- -->` is
  invalid inside JSX and will break the build).
- **Quoting:** double quotes for string-literal JSX attributes (`type="email"`), no quotes for
  expression attributes (`disabled={isDisabled}`).
- **Callback props:** inline arrow functions are fine in examples for brevity
  (`onClick={() => setVisible(false)}`).

---

## Code blocks and doc length

### 17. Fenced code language tags

| Block kind                             | Language tag             | Notes                                                     |
| -------------------------------------- | ------------------------ | --------------------------------------------------------- |
| JSX/React usage outside a live example | ` ```jsx ` or ` ```tsx ` | Use `tsx` when the snippet includes type annotations.     |
| Plain JS (imports, config)             | ` ```js `                | E.g. an import snippet in a getting-started doc.          |
| Shell commands                         | ` ```bash `              | Install/build/CLI commands.                               |
| MDX/Markdown                           | ` ```mdx ` / ` ```md `   | When this guide (or a meta-doc) shows authoring patterns. |

Untagged fenced blocks display without highlighting — never ship one. A live example handles its
own source-block highlighting automatically (default language `jsx`); the table above is for
fenced blocks written by hand, outside a live example.

### 18. Partial vs full code

Live example blocks (whether inline JSX or an extracted file) should be standalone and runnable.
Inline ` ```jsx ` snippets in narrative sections can be partial — show only the prop or pattern
under discussion, assume the reader has the surrounding setup from earlier in the doc.

### 19. Inline code vs code blocks

- **Inline backticks** for single identifiers, prop names, file paths, short literal values —
  `` `disabled` ``, `` `aria-current="page"` ``.
- **Fenced blocks** for anything multi-line, or a one-liner the reader will copy and run.

### 20. Document length and splitting

Split when a `##` section has more than three `###` sub-sections covering distinct topics, or the
doc exceeds ~600 lines, or the ToC needs scrolling to see all top-level sections. The exception is
a large family reference with many sub-components that still reads end-to-end as one coherent doc
— a long doc isn't automatically wrong, but a new component approaching this size is a signal to
consider splitting by concern (e.g. moving cross-cutting layout guidance to its own guide and
linking back) rather than defaulting to one giant page.

---

## Lint checklist

Before opening a PR with a doc change, verify:

- [ ] **Voice check ([§1](#1-voice-by-doc-type)):** if the doc has a `## API` section, no
      second-person or first-person plural in prose you touched: `grep -niE "\b(you|your|yours|we|our|ours|us)\b" <file>`.
      For conceptual/walkthrough docs, "you/your" are fine; confirm "we/us/our" are absent.
- [ ] Every `##`/`###`/`####` heading has an explanatory sentence before the next block ([§2](#2-every-heading-earns-its-paragraph)).
- [ ] No marketing adjectives in prose ([§3](#3-describe-behavior-not-benefits)).
- [ ] Frontmatter has `title`, `description` (<160 chars, instructive), and `toc` set intentionally ([§6](#6-frontmatter)).
- [ ] Variant-centric components promote their variant section right after the basic example;
      other components keep variant/dark-mode sections later, and don't get a dedicated
      `## Theming` heading ([§7](#7-section-order)).
- [ ] `## Accessibility` is present only if the component genuinely warrants it — not added by
      default — and uses that exact name, not "Regarding accessibility" or similar, when present
      ([§7](#7-section-order), [§13](#13-accessibility-patterns)).
- [ ] Heading levels don't skip; `##`/`###` under ~25 characters, sentence case, no trailing punctuation ([§8](#8-heading-hierarchy), [§9](#9-heading-length-case-and-punctuation)).
- [ ] `## API` uses the generated props-table shortcode exclusively — no hand-written prop tables —
      and its sub-component order matches how they're introduced in prose, not blind
      alphabetization ([§10](#10-the--api-section-template)).
- [ ] Every live example either has inline children, a hydrated file reference for anything
      interactive, or a source override with a stated reason ([§11](#11-live-examples-over-static-code)).
- [ ] Every callout uses `type`, not `context` ([§12](#12-callouts)).
- [ ] If the component intentionally omits behavior a reader might expect, it's documented under `## Scope` ([§13a](#13a-the--scope-section)).
- [ ] Cross-references use the internal doc-reference syntax for same-site links and a plain URL for sibling-site links ([§15](#15-cross-references)).
- [ ] JSX examples: 2-space indent, `className` ordered base → modifier → state, self-closing tags, `{/* JSX comments */}` ([§16](#16-jsx-formatting-in-examples)).
- [ ] All fenced code blocks have a language tag ([§17](#17-fenced-code-language-tags)).

---

## What's not in this guide (yet)

To propose a new convention: find at least three docs that already follow (or would benefit from)
the pattern, then open a PR adding the section here, citing those docs as evidence.

Currently unwritten:

- Convention for documenting components with an imperative ref API (`useImperativeHandle`) — none
  currently exist in the public surface, so there's no precedent to codify yet.
- Convention for when a demo belongs in its own file vs. staying inline as static JSX — today's
  rule of thumb (§11: "needs a hook → extract it") covers the common case but not every edge case
  (e.g. an example that's static today but likely to grow interactive later).
- i18n/translation notes for `aria-label` and similar attributes in examples.
- Screenshot conventions for the handful of docs with hand-drawn tables — whether these should
  eventually become props-table-adjacent shortcodes instead of raw `<table>` JSX.
- When to set the optional frontmatter fields from §6 — the schema supports them but no current doc
  exercises them, so there's no real precedent for the bar at which they're worth setting.
