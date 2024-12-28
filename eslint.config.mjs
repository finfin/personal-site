import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'next/core-web-vitals',
  'next/typescript',
)), {
    plugins: {
        react: fixupPluginRules(react),
        '@stylistic': stylistic
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
            ...globals.node,
        },

        ecmaVersion: 2023,
        sourceType: 'module',

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: 'detect',
        },
    },

    rules: {
        'no-console': 'warn',
        'dot-notation': 'error',
        'no-else-return': 'error',
        'no-floating-decimal': 'error',
        'no-sequences': 'error',
        'array-bracket-spacing': 'error',
        'computed-property-spacing': ['error', 'never'],
        curly: 'error',
        'no-lonely-if': 'error',
        'no-unneeded-ternary': 'error',
        'one-var-declaration-per-line': 'error',

        quotes: ['error', 'single', {
            allowTemplateLiterals: false,
            avoidEscape: true,
        }],

        'array-callback-return': 'off',
        'prefer-const': 'error',
        'import/prefer-default-export': 'off',

        'sort-imports': ['error', {
            ignoreCase: true,
            ignoreDeclarationSort: true,
        }],

        'no-unused-expressions': 'off',
        'no-prototype-builtins': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/href-no-hash': [0],
        'react/display-name': 0,
        'react/no-deprecated': 'error',

        'react/no-unsafe': ['error', {
            checkAliases: true,
        }],

        'react/jsx-sort-props': ['error', {
            ignoreCase: true,
        }],

        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 0,
        '@stylistic/indent': ['error', 2],
    },
}];
