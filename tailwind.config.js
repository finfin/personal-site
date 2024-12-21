import typography from '@tailwindcss/typography'

const config = {
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-fira-code)'],
      },
      typography: {
        DEFAULT: {
          css: {
            'ul > li::marker': {
              color: 'var(--color-primary)',
            },
            'ol > li::marker': {
              color: 'var(--color-primary)',
            },
            maxWidth: 'initial',
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              fontWeight: '400',
              backgroundColor: 'rgb(var(--tw-prose-pre-bg))',
              paddingLeft: '0.375rem',
              paddingRight: '0.375rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
            },
          },
        },
        xl: {
          css: {
            lineHeight: '1.6',
            pre: {
              fontSize: 'var(--text-base)',
            },
            code: {
              fontSize: 'var(--text-base)',
            },
            'thead th, tbody td, tfoot td': {
              paddingTop: 'calc(var(--spacing)* 2)',
              paddingBottom: 'calc(var(--spacing)* 2)',
              border: '1px solid'
            },
            'thead th:first-child, tbody td:first-child, tfoot td:first-child': {
              paddingInlineStart: 'calc(var(--spacing)* 2)',
            }
          }
        }
      },
    },
  },
  plugins: [
    typography,
  ],
  darkMode: 'class',
}

export default config
