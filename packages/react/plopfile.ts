import fs from 'node:fs'
import path from 'node:path'

const PASCAL_RE = /^[A-Z][A-Za-z0-9]*$/

export default function (plop) {
  plop.setGenerator('component', {
    description:
      'Scaffold a standalone component: <Name>.tsx + index.ts + spec, wired into src/index.ts',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase, no Cx prefix, e.g. "Chip"):',
        validate: (value) => {
          if (!value) return 'Name is required'
          if (!PASCAL_RE.test(value)) return 'Use PascalCase, e.g. "Chip"'
          if (value.startsWith('Cx')) return 'No Cx prefix — see CONVENTIONS.md'
          return true
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'plop-templates/Component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/index.ts',
        templateFile: 'plop-templates/component-index.ts.hbs'
      },
      {
        type: 'add',
        path: 'test/components/{{kebabCase name}}/{{pascalCase name}}.spec.tsx',
        templateFile: 'plop-templates/Component.spec.tsx.hbs'
      },
      {
        type: 'append',
        path: 'src/index.ts',
        pattern: '// plop:import',
        template: "import { {{pascalCase name}} } from './components/{{kebabCase name}}'"
      },
      {
        type: 'append',
        path: 'src/index.ts',
        pattern: '// plop:export',
        template: '  {{pascalCase name}},'
      }
    ]
  })

  plop.setGenerator('sub', {
    description:
      'Scaffold a sub-part for an existing compound family (e.g. Avatar + Badge -> AvatarBadge, ' +
      "a flat named export from the avatar/ folder). Requires the root folder's index.ts to " +
      'already have the // plop:sub-export marker — see CONVENTIONS.md. The first sub-part of a ' +
      'new family is written by hand (including that marker); every part after that is generated.',
    prompts: [
      {
        type: 'input',
        name: 'root',
        message: 'Root component name (existing compound family, PascalCase, e.g. "Avatar"):',
        validate: (value) => {
          if (!value) return 'Root is required'
          if (!PASCAL_RE.test(value)) return 'Use PascalCase, e.g. "Avatar"'
          return true
        }
      },
      {
        type: 'input',
        name: 'part',
        message: 'Sub-part name (PascalCase, e.g. "Badge" -> Avatar.Badge):',
        validate: (value) => {
          if (!value) return 'Part name is required'
          if (!PASCAL_RE.test(value)) return 'Use PascalCase, e.g. "Badge"'
          return true
        }
      }
    ],
    actions: (data) => {
      const rootIndexPath = path.join(
        plop.getPlopfilePath(),
        'src/components',
        plop.getHelper('kebabCase')(data.root),
        'index.ts'
      )

      return [
        () => {
          if (!fs.existsSync(rootIndexPath)) {
            throw new Error(
              `${rootIndexPath} doesn't exist. "sub" only adds a part to an existing compound ` +
                `family — scaffold the family's root (and its first sub-part, by hand, with the ` +
                `plop:sub-export marker) before generating additional parts. See CONVENTIONS.md.`
            )
          }
          const contents = fs.readFileSync(rootIndexPath, 'utf8')
          if (!contents.includes('// plop:sub-export')) {
            throw new Error(
              `${rootIndexPath} is missing the // plop:sub-export marker. The first sub-part of ` +
                `a compound family is written by hand, including that marker — see ` +
                `CONVENTIONS.md's compound-component section for the exact shape.`
            )
          }
          return `${rootIndexPath} has the required marker.`
        },
        {
          type: 'add',
          path: 'src/components/{{kebabCase root}}/{{pascalCase root}}{{pascalCase part}}.tsx',
          templateFile: 'plop-templates/RootPart.tsx.hbs'
        },
        {
          type: 'add',
          path: 'test/components/{{kebabCase root}}/{{pascalCase root}}{{pascalCase part}}.spec.tsx',
          templateFile: 'plop-templates/RootPart.spec.tsx.hbs'
        },
        {
          type: 'append',
          path: 'src/components/{{kebabCase root}}/index.ts',
          pattern: '// plop:sub-export',
          template:
            "export { {{pascalCase root}}{{pascalCase part}} } from './{{pascalCase root}}{{pascalCase part}}'\n" +
            "export type { {{pascalCase root}}{{pascalCase part}}Props } from './{{pascalCase root}}{{pascalCase part}}'"
        },
        {
          type: 'append',
          path: 'src/index.ts',
          pattern: '// plop:import',
          template:
            "import { {{pascalCase root}}{{pascalCase part}} } from './components/{{kebabCase root}}'"
        },
        {
          type: 'append',
          path: 'src/index.ts',
          pattern: '// plop:export',
          template: '  {{pascalCase root}}{{pascalCase part}},'
        }
      ]
    }
  })
}
