/**
 * Postinstall script to create symlinks needed for @chassis-ui/css SCSS compilation.
 *
 * @chassis-ui/css/_vendor.scss uses a relative path to load @chassis-ui/tokens,
 * which requires a nested node_modules structure. The tokens package also ships
 * the files under a different directory name than what _vendor.scss expects.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function ensureSymlink(linkPath, target) {
  try {
    if (fs.existsSync(linkPath)) return
    fs.mkdirSync(path.dirname(linkPath), { recursive: true })
    fs.symlinkSync(target, linkPath, 'junction')
    console.log(`Created symlink: ${linkPath} → ${target}`)
  } catch (e) {
    console.warn(`Skipping symlink ${linkPath}: ${e.message}`)
  }
}

// Symlink 1: nested tokens package so _vendor.scss relative path resolves
ensureSymlink(
  path.join(root, 'node_modules/@chassis-ui/css/node_modules/@chassis-ui/tokens'),
  '../../../../@chassis-ui/tokens',
)

// Symlink 2: path alias inside tokens package (wrong dir name in _vendor.scss)
ensureSymlink(
  path.join(root, 'node_modules/@chassis-ui/tokens/dist/web/docs/chassis'),
  '../chassis-docs',
)
