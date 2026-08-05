#!/usr/bin/env node

/*!
 * Version Reference Sync Script
 *
 * Propagates @chassis-ui/react's version (the source of truth, owned by `changeset version` —
 * see .changeset/) into the handful of places that display it but aren't part of the pnpm
 * workspace's own dependency graph, so `changeset version` can't reach them on its own:
 * README.md's download-archive link and packages/site/config.yml's `current_version` field.
 *
 * Run automatically as part of `pnpm changeset:version`, right after `changeset version` itself
 * has already bumped packages/react/package.json — never invoked standalone with an explicit
 * version, since the react package's own package.json is always the source of truth.
 *
 * Copyright 2025-2026 Ozgur Gunes
 * Licensed under MIT
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?$/

async function readReactVersion() {
  const pkgPath = path.resolve('packages/react/package.json')
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'))

  if (!pkg.version || !SEMVER_RE.test(pkg.version)) {
    console.error(`❌ Invalid or missing version in packages/react/package.json: "${pkg.version}"`)
    process.exit(1)
  }

  return pkg.version
}

async function syncReadme(version) {
  const file = 'README.md'
  const original = await fs.readFile(file, 'utf8')
  const updated = original.replace(
    /archive\/v\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?\.zip/,
    `archive/v${version}.zip`
  )

  if (updated === original) {
    return false
  }

  await fs.writeFile(file, updated, 'utf8')
  console.log(`📄 Updated ${file} download link → v${version}`)
  return true
}

async function syncSiteConfig(version) {
  const file = 'packages/site/config.yml'
  const original = await fs.readFile(file, 'utf8')
  const updated = original.replace(
    /^current_version:(\s*)"[^"]*"/m,
    (_match, spacing) => `current_version:${spacing}"${version}"`
  )

  if (updated === original) {
    return false
  }

  await fs.writeFile(file, updated, 'utf8')
  console.log(`📄 Updated ${file}'s current_version → ${version}`)
  return true
}

async function main() {
  const version = await readReactVersion()
  console.log(`🔄 Syncing version references to v${version}`)

  const results = await Promise.all([syncReadme(version), syncSiteConfig(version)])
  const updatedCount = results.filter(Boolean).length

  console.log(
    updatedCount > 0
      ? `✅ Synced ${updatedCount} file${updatedCount === 1 ? '' : 's'}`
      : 'ℹ️  Already in sync, nothing to update'
  )
}

main().catch((error) => {
  console.error(`❌ Unexpected error: ${error.message}`)
  process.exit(1)
})
