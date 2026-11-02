// Each brand's fonts, copied from the Chassis assets (`vendor/assets`), so a brand added to `BRANDS`
// brings its own with no further change here. The tokens name each brand's faces, and without the
// files a component renders in fallback fonts. Logos and other images are a project's, not the
// library's, and stay out.
//
// `pnpm vendor` unpacks one brand per run, the site's by default, so the build asks for each.
import { execFileSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import postcss from 'postcss'
import { ASSETS, BRANDS, CHASSIS_ICONS, PROJECT, ROOT, type Brand } from './paths.ts'

export function vendorBrands() {
  for (const brand of BRANDS) {
    execFileSync('pnpm', ['vendor'], {
      cwd: ROOT,
      env: { ...process.env, CHASSIS_BRAND: brand },
      stdio: 'inherit'
    })
  }
}

export const assetDir = (brand: Brand, type: string) =>
  path.join(ASSETS, 'dist/web/docs', brand, type)

// The unicode-range subsets the assets build splits a face into: the names of its ranges, and a
// range of its own by code points (`u2190-2193`).
const SUBSET =
  /-(?:latin|latin-ext|cyrillic|cyrillic-ext|greek|greek-ext|vietnamese|hebrew|arabic|math|symbols|symbols2|u[0-9a-f]+-[0-9a-f]+)(\.woff2)$/

export interface FontFace {
  family: string
  style: string
  weight: string
  source: string
  // The file's path in the system, where tokens.json lists it and tokens.css loads it from.
  file: string
}

// The brand's @font-face rules, from the `fonts.css` beside its font files. A built folder splits
// each face by unicode range, and one file per face is what a preview needs.
function brandFaces(brand: Brand): FontFace[] {
  const dir = assetDir(brand, 'fonts')
  const faces = new Map<string, FontFace>()
  postcss
    .parse(fs.readFileSync(path.join(dir, 'fonts.css'), 'utf8'))
    .walkAtRules('font-face', (rule) => {
      const get = (prop: string) => {
        let v = ''
        rule.walkDecls(prop, (d) => {
          v = d.value
        })
        return v
      }
      // A subset file of a face (`ui-latin-ext.woff2`) is swapped for the face's full file beside
      // it (`ui.woff2`), where there is one. Only known subset names are taken off, so
      // `ui-italic.woff2` stays itself.
      const named = /url\("?([^")]+)"?\)/.exec(get('src'))![1]
      const full = named.replace(SUBSET, '$1')
      const url = full !== named && fs.existsSync(path.join(dir, full)) ? full : named
      const face = {
        family: get('font-family').replace(/["']/g, ''),
        style: get('font-style') || 'normal',
        weight: get('font-weight') || '400',
        source: path.join(dir, url),
        file: `fonts/${brand}-${url}`
      }
      faces.set(`${face.family}|${face.style}|${face.weight}`, face)
    })
  return [...faces.values()]
}

export function fontFaces(): FontFace[] {
  return [
    ...BRANDS.flatMap(brandFaces),
    {
      family: 'Chassis-Icons',
      style: 'normal',
      weight: '400',
      source: path.join(CHASSIS_ICONS, 'icons/chassis-icons.woff2'),
      file: 'fonts/chassis-icons.woff2'
    }
  ]
}

export function writeFonts(faces: FontFace[]) {
  for (const { source, file } of faces) {
    const out = path.join(PROJECT, file)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.copyFileSync(source, out)
  }
}
