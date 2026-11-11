//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export default [
    ...tanstackConfig,
    {
        rules: {
            'import/no-cycle': 'off',
            'import/order': 'off',
            'sort-imports': 'off',
            '@typescript-eslint/array-type': 'off',
            '@typescript-eslint/require-await': 'off',
            'pnpm/json-enforce-catalog': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            'no-shadow': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
        },
    },
    {
        ignores: ['eslint.config.js', 'prettier.config.js', 'src/routeTree.gen.ts', 'dist', '.tmp-build', '.agents/**'],
    },
]
