import { createTheme } from '@mantine/core'

export const theme = createTheme({
  defaultGradient: {
    from: '#7267EF', // Converted from rgb(114, 103, 239)
    to: 'var(--bs-primary)', // You'll need to replace this with the actual hex value
    deg: 270
  },
  defaultRadius: 'sm',
  cursorType: 'pointer',
  autoContrast: true,
  luminanceThreshold: 0.45,

  white: '#FDFDFD',
  black: '#28282B',

  colors: {
    brand: [
      '#edf2ff',
      '#dbe4ff',
      '#bac8ff',
      '#91a7ff',
      '#748ffc',
      '#5c7cfa',
      '#4c6ef5',
      '#4263eb',
      '#3b5bdb',
      '#364fc7'
    ]
  },

  primaryColor: 'brand',

  fontFamily: 'var(--font-work-sans)',

  headings: {
    fontFamily: 'var(--font-lora)'
  },

  spacing: {
    xs: '0.9rem',
    sm: '1.2rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem'
  },

  components: {
    Anchor: {
      defaultProps: {
        c: 'blue',
        size: 'sm'
      }
    },
    ActionIcon: {
      defaultProps: {
        variant: 'gradient'
      }
    },
    Button: {
      defaultProps: {
        variant: 'gradient'
      }
    }
  }
})