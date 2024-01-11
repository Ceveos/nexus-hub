import { type Config } from "tailwindcss";
import * as colors from "tailwindcss/colors";
import typographyStyles from './typography'
import headlessuiPlugin from '@headlessui/tailwindcss'

export default {
  darkMode: "class",
  future: {
    hoverOnlyWhenSupported: true
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,md}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx,md", // Tremor module
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          ...colors.slate,
          dark: {
            ...colors.zinc,
          },
        },
        accent: {
          ...colors.blue,
          dark: {
            ...colors.blue,
          },
        },

        /* Theme colors */
        th: {
          background: {
            DEFAULT: colors.gray[200],
            dark: colors.neutral[800],
          },

          foreground: {
            DEFAULT: colors.white,
            dark: colors.zinc[900],
          },
        },
      },
      keyframes: {
        wiggle: {
          "0%, 100%": {
            transform: "translateX(0%)",
            transformOrigin: "50% 50%",
          },
          "15%": { transform: "translateX(-6px) rotate(-6deg)" },
          "30%": { transform: "translateX(9px) rotate(6deg)" },
          "45%": { transform: "translateX(-9px) rotate(-3.6deg)" },
          "60%": { transform: "translateX(3px) rotate(2.4deg)" },
          "75%": { transform: "translateX(-2px) rotate(-1.2deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.8s both",
      },
      boxShadow: {
        glow: '0 0 4px rgb(0 0 0 / 0.1)',
      },
      maxWidth: {
        lg: '33rem',
        '2xl': '40rem',
        '3xl': '50rem',
        '5xl': '66rem',
      },
      opacity: {
        1: '0.01',
        2.5: '0.025',
        7.5: '0.075',
        15: '0.15',
      },
    },
    fontSize: {
      '2xs': ['0.75rem', { lineHeight: '1.25rem' }],
      xs: ['0.8125rem', { lineHeight: '1.5rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    typography: typographyStyles,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    headlessuiPlugin
  ],
} satisfies Config;
