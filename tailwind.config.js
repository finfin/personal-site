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
          }
        }
      },
    },
  },
  plugins: [
    typography,
  ],
}

export default config
