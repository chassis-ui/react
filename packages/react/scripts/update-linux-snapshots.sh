#!/usr/bin/env bash
# Regenerates this package's Linux Playwright visual baselines (test/visual/**-chromium-linux.png)
# inside the exact container image .github/workflows/ci.yml's `visual-regression` job runs against,
# so what you commit is what CI will actually compare. Running `playwright test --update-snapshots`
# directly on macOS only ever produces `-chromium-darwin.png` files — the `-linux.png` ones can't be
# generated correctly outside a matching Linux container (see AGENTS.md's Visual regression section).
#
# This does NOT bind-mount the repo into the container: pnpm install inside a Linux container would
# rebuild native deps (esbuild, sharp, @parcel/watcher) as Linux binaries and clobber your host
# node_modules if it wrote directly into a mounted volume. Instead it copies the repo into the
# container's own filesystem, does everything there, and copies only the resulting snapshot PNGs
# back out — your local node_modules is never touched.
#
# Forces --platform linux/amd64 unconditionally, even on Apple Silicon: the image is multi-arch, so
# Docker silently runs the native arm64 build otherwise, which is not what CI's `ubuntu-latest`
# (x86_64) runners execute.
#
# Usage:
#   pnpm --filter @chassis-ui/react exec bash scripts/update-linux-snapshots.sh test/visual/toast-notification.visual.spec.ts
#   pnpm --filter @chassis-ui/react exec bash scripts/update-linux-snapshots.sh                      # ALL visual spec files
#
# Pass one or more spec paths (relative to packages/react, same as you'd pass to `playwright test`)
# to scope the run to just the family you touched — running with no args regenerates every family's
# Linux baselines, which is rarely what you want for a one-component change.

set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "error: docker is required but not found on PATH." >&2
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  echo "error: docker CLI found but the daemon isn't reachable -- is Docker Desktop/colima running?" >&2
  exit 1
fi

REACT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(cd "$REACT_DIR/../.." && pwd)"
CONTAINER_NAME="cx-visual-snapshot-update-$$"
WORKDIR="$(mktemp -d)"
ARCHIVE="$WORKDIR/repo.tar.gz"

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

PLAYWRIGHT_VERSION="$(node -p "require('$REACT_DIR/package.json').devDependencies['@playwright/test']")"
IMAGE="mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble"
PNPM_VERSION="$(node -p "require('$REPO_ROOT/package.json').packageManager.match(/pnpm@([\\d.]+)/)[1]")"

echo "==> Using $IMAGE (pinned to this package's @playwright/test version)"

echo "==> Archiving repo (excluding node_modules, build output, VCS)"
# COPYFILE_DISABLE avoids macOS AppleDouble '._*' sidecar files ending up in the tarball — Playwright's
# spec glob picks those up as real files and crashes trying to parse them as source.
COPYFILE_DISABLE=1 tar \
  --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='_storybook' \
  --exclude='test-results' --exclude='coverage' --exclude='playwright-report' \
  --exclude='._*' \
  -czf "$ARCHIVE" -C "$REPO_ROOT" .

echo "==> Starting container ($IMAGE, forced linux/amd64)"
docker run -d --platform linux/amd64 --name "$CONTAINER_NAME" "$IMAGE" sleep infinity >/dev/null

docker exec "$CONTAINER_NAME" mkdir -p /repo
docker cp "$ARCHIVE" "$CONTAINER_NAME:/repo.tar.gz"
docker exec "$CONTAINER_NAME" bash -lc "cd /repo && tar -xzf /repo.tar.gz && rm -f /repo.tar.gz"

echo "==> Installing dependencies"
docker exec "$CONTAINER_NAME" bash -lc "
  cd /repo &&
  corepack enable &&
  corepack prepare pnpm@${PNPM_VERSION} --activate &&
  pnpm install --frozen-lockfile
"

echo "==> Building Storybook"
docker exec "$CONTAINER_NAME" bash -lc "cd /repo/packages/react && pnpm storybook:build --quiet"

SPEC_ARGS=("$@")
if [ ${#SPEC_ARGS[@]} -eq 0 ]; then
  echo "==> No spec files given — regenerating ALL visual families' Linux baselines"
  SPEC_ARGS=("test/visual/")
fi

echo "==> Regenerating baselines: ${SPEC_ARGS[*]}"
docker exec "$CONTAINER_NAME" bash -lc 'cd /repo/packages/react && pnpm exec playwright test "$@" --update-snapshots' bash "${SPEC_ARGS[@]}"

echo "==> Re-running twice more in normal (non-update) mode to catch capture races"
echo "    (a screenshot taken mid-transition/mid-animation can 'pass' once under --update-snapshots"
echo "     with no baseline to catch it, then fail immediately on the very next real run)"
STABLE=true
for i in 1 2; do
  if ! docker exec "$CONTAINER_NAME" bash -lc 'cd /repo/packages/react && pnpm exec playwright test "$@"' bash "${SPEC_ARGS[@]}"; then
    STABLE=false
    break
  fi
done

# Copy back regardless of the stability check's outcome — an unstable rerun still means the
# --update-snapshots pass above did real work, and losing it would force a full redo (reinstall,
# rebuild Storybook, everything) just to retry the verification.
echo "==> Copying regenerated snapshots back"
for spec in "${SPEC_ARGS[@]}"; do
  if [ "$spec" = "test/visual/" ]; then
    docker cp "$CONTAINER_NAME:/repo/packages/react/test/visual/." "$REACT_DIR/test/visual/"
  else
    snap_dir="test/visual/__snapshots__/$(basename "$spec")"
    docker cp "$CONTAINER_NAME:/repo/packages/react/$snap_dir/." "$REACT_DIR/$snap_dir/"
  fi
done

if [ "$STABLE" = false ]; then
  echo "==> WARNING: a stability-check rerun failed (see Playwright output above)." >&2
  echo "    Snapshots were still copied back so the update-snapshots work isn't lost, but one of" >&2
  echo "    them may be a capture-race rather than a real change -- review closely before committing:" >&2
  echo "      git status packages/react/test/visual/" >&2
  echo "      git diff --stat packages/react/test/visual/" >&2
  exit 1
fi

echo "==> Stability confirmed. Review the diff (especially any non-text/layout changes) before committing:"
echo "      git status packages/react/test/visual/"
echo "      git diff --stat packages/react/test/visual/"
