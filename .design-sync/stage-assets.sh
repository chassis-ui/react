#!/usr/bin/env bash
# Stage the stylesheet design-sync ships as `cfg.cssEntry`, inside the DS package.
#
# WHY A STAGING STEP AT ALL
# `cfg.cssEntry` is deliberately bounded to the DS package directory by
# package-build.mjs (its content uploads verbatim, so a path anywhere under the
# workspace root would let a config exfiltrate project files). Everything this
# design system needs to look right lives OUTSIDE packages/react:
#
#   1. @chassis-ui/css  — the framework: reboot, grid, utilities, and the ~1330
#      `--cx-*` custom properties every component's styling reads. A pnpm
#      symlink out to the store, so pointing cssEntry at it is rejected with
#      "resolves outside the package — skipped" and designs render unstyled.
#   2. @chassis-ui/icons — the `cx-*` glyph classes `Icon`/`NotificationIcon`
#      emit in font mode. Not reachable via cfg.extraFonts either: that path
#      keeps only @font-face rules and discards the glyph classes, and the
#      upstream url() regex requires the URL to end at the font extension, so
#      this package's cache-busted `url("./chassis-icons.woff2?<hash>")` matches
#      nothing and the face is dropped silently. Both are handled here: the
#      whole stylesheet is concatenated, and the ?<hash> is stripped so the
#      converter's font extractor can see and copy the woff2/woff.
#   3. packages/react/dist/style.css — this package's OWN component CSS
#      (Calendar, DatePicker, Notification, Table, …). cssEntry and the dist
#      sidecar are alternatives, not additives, in package-build.mjs — setting
#      cssEntry drops dist/style.css unless it is folded in here.
#
# The result is what a real consuming app loads, in the order it loads it, and
# the framework half is byte-identical to what .storybook/preview.tsx imports —
# so previews and the reference storybook style from the same bytes.
#
# The staging dir is gitignored and rebuilt on every sync; nothing is vendored
# into git. Wired into cfg.buildCmd, so re-syncs re-stage automatically.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/packages/react"
DEST_DIR="$PKG/.ds-css"
DEST="$DEST_DIR/chassis.min.css"

FRAMEWORK="$PKG/node_modules/@chassis-ui/css/dist/css/chassis.min.css"
ICONS_DIR="$ROOT/packages/site/node_modules/@chassis-ui/icons/icons"
ICONS_CSS="$ICONS_DIR/chassis-icons.min.css"
OWN_CSS="$PKG/dist/style.css"

for f in "$FRAMEWORK" "$ICONS_CSS"; do
  [ -f "$f" ] || { echo "stage-assets: $f not found — run pnpm install first" >&2; exit 1; }
done
[ -f "$OWN_CSS" ] || { echo "stage-assets: $OWN_CSS not found — run pnpm react:build first" >&2; exit 1; }

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

{
  echo "/* --- @chassis-ui/css framework (chassis.min.css) --- */"
  cat "$FRAMEWORK"
  echo
  echo "/* --- @chassis-ui/icons (cx-* glyph classes + @font-face; ?hash stripped) --- */"
  # Drop the cache-busting query so extractFonts' url() regex matches and the
  # font files get copied into the bundle's fonts/ dir.
  sed -E 's/(\.(woff2?|ttf|otf))\?[A-Za-z0-9]+/\1/g' "$ICONS_CSS"
  echo
  echo "/* --- @chassis-ui/react own component CSS (dist/style.css) --- */"
  cat "$OWN_CSS"
} > "$DEST"

# url()s in the icons block are relative to the stylesheet, so the font files
# must sit beside it for the converter to resolve and copy them.
cp "$ICONS_DIR/chassis-icons.woff2" "$ICONS_DIR/chassis-icons.woff" "$DEST_DIR/"

echo "stage-assets: wrote $(du -h "$DEST" | cut -f1) -> packages/react/.ds-css/chassis.min.css (framework + icons + own component CSS)"
