---
"@chassis-ui/react": major
---

**Breaking:** `Navbar` is rewritten to align with the underlying CSS framework's current navbar, replacing the old Bootstrap-style viewport-breakpoint `expand`/`Collapse` mechanics with container-query-based `expand` and a `Drawer`-based mobile menu.

Composition changes from `<Collapse className="navbar-collapse">` wrapping the drawer's contents to a real `<Drawer>`:

```diff
- <Navbar expand="lg" colorScheme="light" className="bg-light">
+ <Navbar expand="large" className="bg-even">
    <Container fluid>
      <NavbarBrand href="#">Navbar</NavbarBrand>
-     <NavbarToggler onClick={() => setVisible(!visible)} />
-     <Collapse className="navbar-collapse" visible={visible}>
-       <NavbarNav>...</NavbarNav>
-     </Collapse>
+     <NavbarToggler
+       aria-controls="navbarDrawer"
+       aria-expanded={visible}
+       aria-label="Toggle navigation"
+       onClick={() => setVisible(!visible)}
+     />
+     <Drawer id="navbarDrawer" placement="end" visible={visible} onClose={() => setVisible(false)}>
+       <DrawerHeader><DrawerTitle>Menu</DrawerTitle></DrawerHeader>
+       <DrawerBody><NavbarNav>...</NavbarNav></DrawerBody>
+     </Drawer>
    </Container>
  </Navbar>
```

Other changes:

- `expand`'s class output changes from suffix (`navbar-expand-{bp}`) to prefix (`{bp}:navbar-expand`), matching the CSS framework's container-query classes. The prop's shape (`boolean | Breakpoint`) is unchanged.
- `colorScheme` (`'dark' | 'light'`, mapped to `.navbar-dark`/`.navbar-light`) is removed — those classes no longer exist. Use the new `'data-cx-theme'` prop instead.
- `color` no longer maps to a `bg-{color}` utility class. It now activates the framework's generic `.context.<color>` styling, matching `Card`/`List`'s existing `color`/`variant` convention — pair with a new `variant` prop (`'solid' | 'outline' | 'smooth'`) for a saturated/bordered/tinted fill.
- New `translucent` prop (`.translucent`) and a fourth `placement` value, `'sticky-bottom'`.
- `NavbarToggler`'s base class changes from `navbar-toggler` alone to `button icon-only navbar-toggler`, and its default icon (when no `children` are passed) is now an `<Icon name="bars-outline" className="navbar-toggler-icon" />` instead of a bare `<span className="navbar-toggler-icon">`.
- `NavbarNav` no longer sets `role="navigation"` on its root element — that was a pre-existing accessibility bug (a nested "navigation" landmark on a `<ul>`, invalid per `aria-allowed-role`). The `<Navbar>`'s own `<nav>` element is the landmark.
