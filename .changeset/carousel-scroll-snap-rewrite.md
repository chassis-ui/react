---
"@chassis-ui/react": major
---

**Breaking:** `Carousel` is rewritten to align with the underlying CSS framework's scroll-snap-based carousel, replacing the old transform/CSS-transition slide mechanics with a real horizontally-scrolling track and `IntersectionObserver`-driven active-slide tracking.

Composition changes from a single `Carousel` wrapping `CarouselItem`s with boolean `controls`/`indicators` props, to explicit sub-components: `CarouselInner` now wraps the `CarouselItem` slides, and `CarouselControlPrev`/`CarouselControlNext`/`CarouselIndicators`/`CarouselPlayPause`/`CarouselOverlay` compose alongside it wherever they're placed in the tree (above, below, or overlaid via `CarouselOverlay`).

```diff
- <Carousel controls indicators wrap={false}>
-   <CarouselItem>
-     <Image src="..." />
-     <CarouselCaption>...</CarouselCaption>
-   </CarouselItem>
- </Carousel>
+ <Carousel ends="stop">
+   <CarouselControlPrev />
+   <CarouselControlNext />
+   <CarouselIndicators />
+   <CarouselInner>
+     <CarouselItem>
+       <Placeholder src="..." />
+     </CarouselItem>
+   </CarouselInner>
+ </Carousel>
```

Other changes:

- `CarouselCaption` is removed — the underlying CSS framework no longer ships a `.carousel-caption` class. Compose caption content directly inside a `CarouselItem` instead.
- `wrap`/`pause`(boolean)/`transition="crossfade"`/`dark` are replaced by `ends` (`'loop' | 'wrap' | 'stop'`, default `'loop'`), `pause` (`'hover' | false`), and `transition="fade"`. There's no `dark` prop — the underlying CSS framework no longer ships a `.carousel-dark` variant.
- New `items`/`itemsGap`/`itemsPeek`/`auto`/`center` props for multi-item, peek, variable-width, and centered layouts.
- New `activeIndex`/`defaultActiveIndex` for controlled/uncontrolled active-slide state, replacing `activeIndex` used as an always-uncontrolled initial value.
- `onSlide`/`onSlid` callbacks now receive a single `{ from, to, direction }` detail object instead of positional `(active, direction)` arguments.
- Autoplay is now opt-in via a new `autoplay` prop, replacing the old `interval`-as-number-means-autoplay default. Carousels that relied on `interval` alone to cycle need `autoplay` added explicitly.
