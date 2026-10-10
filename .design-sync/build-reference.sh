#!/usr/bin/env bash
# Build the reference storybook design-sync compares previews against, then
# give it the brand fonts.
#
# WHY THE FONTS
# @chassis-ui/css names `Inter`, `Archivo Narrow` and `Fira Code` but ships no
# @font-face rules, and .storybook/preview.tsx loads none either. The uploaded
# bundle does carry them (cfg.extraFonts -> .design-sync/fonts.css). Left
# alone, the reference renders a system fallback while the preview renders
# Inter, so every text-bearing story differs in metrics and wrapping for a
# reason that has nothing to do with the component. Injecting the same
# @font-face rules here makes both sides of a compare sheet use the real font.
#
# `storybook build` empties its output directory, so the injection has to be
# redone after every build: always build the reference through this script.
# SKIP_BUILD=1 redoes only the injection.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.design-sync/sb-reference"
FONTS="$ROOT/vendor/assets/dist/web/docs/chassis/fonts"
MAP="$ROOT/.design-sync/fonts.css"

if [ -z "${SKIP_BUILD:-}" ]; then
  (cd "$ROOT/packages/react" && pnpm exec storybook build -c .storybook -o "$OUT" --quiet)
fi

[ -f "$OUT/iframe.html" ] || { echo "build-reference: $OUT/iframe.html not found" >&2; exit 1; }
[ -d "$FONTS" ] || { echo "build-reference: $FONTS not found — run pnpm vendor first" >&2; exit 1; }

rm -rf "$OUT/ds-fonts"
mkdir -p "$OUT/ds-fonts"
cp "$FONTS"/text-*.woff2 "$FONTS"/display-*.woff2 "$FONTS"/code-*.woff2 "$OUT/ds-fonts/"
sed 's|\.\./vendor/assets/dist/web/docs/chassis/fonts/|./|g' "$MAP" > "$OUT/ds-fonts/fonts.css"

if ! grep -q 'ds-fonts/fonts.css' "$OUT/iframe.html"; then
  perl -0pi -e 's|</head>|<link rel="stylesheet" href="./ds-fonts/fonts.css"></head>|' "$OUT/iframe.html"
fi
grep -q 'ds-fonts/fonts.css' "$OUT/iframe.html" || { echo "build-reference: could not inject the font stylesheet" >&2; exit 1; }

echo "build-reference: $OUT ready, brand fonts injected"
