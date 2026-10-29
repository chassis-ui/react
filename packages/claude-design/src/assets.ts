// Each brand's fonts, copied from the Chassis assets (the `vendor/assets` submodule), so a brand
// added to `BRANDS` brings its own with no further change here. The tokens name each brand's faces,
// and without the files a component renders in fallback fonts. Logos and other images are a
// project's, not the library's, and stay out.
//
// A brand's folder of one asset type resolves as the assets build resolves it: its built docs
// output (`dist/web/docs/<brand>/<type>`) where the pinned build made one, else its own source
// folder (`source/<brand>/docs/<type>`), else the default brand's, which every brand falls back
// to. The built output comes first: its fonts are the ones the docs sites serve.
import * as fs from 'fs'
import * as path from 'path'
import postcss from 'postcss'
import { ASSETS, BRANDS, CHASSIS_ICONS, PROJECT, type Brand } from './paths.ts'

export function assetDir(brand: Brand, type: string): string {
  const candidates = [
    path.join(ASSETS, 'dist/web/docs', brand, type),
    path.join(ASSETS, 'source', brand, 'docs', type),
    path.join(ASSETS, 'source/default/docs', type)
  ]
  const dir = candidates.find((d) => fs.existsSync(d))
  if (!dir) throw new Error(`assets: no ${type} for ${brand} in ${candidates.join(', ')}`)
  return dir
}

// The unicode-range subsets the assets build splits a face into (its `--subset` names).
const SUBSET =
  /-(?:latin|latin-ext|cyrillic|cyrillic-ext|greek|greek-ext|vietnamese|hebrew|arabic|math|symbols)(\.woff2)$/

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
