import React from 'react'
import { expectTypeOf } from 'vitest'

import {
  Avatar,
  Button,
  Chip,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  PaginationItem,
  usePagination
} from '../src/index'

// Type-level assertions for the public API's generic surface.
//
// `api-report.md` pins the *text* of the emitted declarations and the runtime specs prove
// behavior — neither catches a type that compiles but is wrong for a consumer, which is exactly
// what happened to the polymorphic components' `ref` and to `usePagination`'s return type (it
// declared refs whose `.current` was non-null, so `prevRef.current.focus()` type-checked and then
// crashed before mount).
//
// Deliberately `.test-d.tsx`, not `.spec.tsx`: `vitest.config.ts` collects only
// `test/**/*.spec.tsx`, so nothing here is ever executed — which matters, because calling
// `usePagination` outside a component would throw. It's checked purely by `pnpm check:types` (and
// its CI step), which covers `test/**/*`. Several assertions below are `@ts-expect-error`: they
// fail to compile if the error stops happening, which is the point — they pin the cases that must
// stay rejected.

// --- Polymorphic `ref`: matches the element each component actually renders ---

// Default element.
expectTypeOf(<Button ref={React.createRef<HTMLButtonElement>()}>Save</Button>).toBeObject()

// `component` moves the ref type with it.
expectTypeOf(
  <Button component="a" href="/x" ref={React.createRef<HTMLAnchorElement>()}>
    Go
  </Button>
).toBeObject()

// `href` switches the rendered element to `<a>` *without* moving the `component` generic off its
// default, so a ref covering both is what a caller actually holds.
expectTypeOf(
  <Button href="/x" ref={React.createRef<HTMLButtonElement | HTMLAnchorElement>()}>
    Go
  </Button>
).toBeObject()

// The same allowance across the rest of the family that switches element on `href`.
expectTypeOf(
  <Chip href="/x" ref={React.createRef<HTMLSpanElement | HTMLAnchorElement>()}>
    Tag
  </Chip>
).toBeObject()
expectTypeOf(
  <Avatar href="/x" ref={React.createRef<HTMLSpanElement | HTMLAnchorElement>()} />
).toBeObject()
expectTypeOf(
  <PaginationItem href="/x" ref={React.createRef<HTMLButtonElement | HTMLAnchorElement>()}>
    1
  </PaginationItem>
).toBeObject()

// A ref for an element the component can never render is still rejected.
expectTypeOf(
  // @ts-expect-error `Button` renders a <button> or an <a>, never an <input>.
  <Button ref={React.createRef<HTMLInputElement>()}>Save</Button>
).toBeObject()

// `component` still type-checks that element's own props.
expectTypeOf(<Button component="a" download="file.txt" href="/x" />).toBeObject()
expectTypeOf(
  // @ts-expect-error `download` is an anchor attribute; the default element is a <button>.
  <Button download="file.txt">Save</Button>
).toBeObject()

// --- Hook result types ---

// Instantiated explicitly rather than as `ReturnType<typeof usePagination>`: on a generic
// function, `ReturnType` erases the type parameter to its *constraint* (`HTMLElement`) rather
// than applying its default (`HTMLButtonElement`), which would quietly test the wrong type.
declare const pagination: ReturnType<typeof usePagination<HTMLButtonElement>>

// `useRef<T>(null)` produces a nullable `.current`, and the published type has to say so.
expectTypeOf(pagination.prevRef).toEqualTypeOf<React.RefObject<HTMLButtonElement | null>>()
expectTypeOf(pagination.nextRef).toEqualTypeOf<React.RefObject<HTMLButtonElement | null>>()
// The bug this pins: the published type used to be the non-null form, so `prevRef.current.focus()`
// compiled and then threw before mount.
expectTypeOf(pagination.prevRef).not.toEqualTypeOf<React.RefObject<HTMLButtonElement>>()
expectTypeOf(pagination.prevRef.current).toBeNullable()

// The element type parameter carries through to both refs.
declare const anchorPagination: ReturnType<typeof usePagination<HTMLAnchorElement>>

expectTypeOf(anchorPagination.prevRef).toEqualTypeOf<React.RefObject<HTMLAnchorElement | null>>()
expectTypeOf(anchorPagination.nextRef).toEqualTypeOf<React.RefObject<HTMLAnchorElement | null>>()

// --- DataGridBody: the static and dynamic forms don't mix ---

interface Row {
  id: string
}

declare const items: Row[]

// The dynamic form: a render function alongside `items`, which is what the loader row is rendered
// through.
expectTypeOf(
  <DataGridBody items={items} onLoadMore={() => {}}>
    {(row: Row) => (
      <DataGridRow id={row.id}>
        <DataGridCell>{row.id}</DataGridCell>
      </DataGridRow>
    )}
  </DataGridBody>
).toBeObject()

// The static form: rows written out directly, no loader props.
expectTypeOf(
  <DataGridBody>
    <DataGridRow id="1">
      <DataGridCell>a</DataGridCell>
    </DataGridRow>
  </DataGridBody>
).toBeObject()

expectTypeOf(
  // @ts-expect-error the loader row is rendered through `children`, so `onLoadMore` needs the
  // render-function form — this combination used to compile and then throw at render.
  <DataGridBody onLoadMore={() => {}}>
    <DataGridRow id="1">
      <DataGridCell>a</DataGridCell>
    </DataGridRow>
  </DataGridBody>
).toBeObject()

expectTypeOf(
  // @ts-expect-error `isLoading` belongs to the same dynamic form as `onLoadMore`.
  <DataGridBody isLoading>
    <DataGridRow id="1">
      <DataGridCell>a</DataGridCell>
    </DataGridRow>
  </DataGridBody>
).toBeObject()
