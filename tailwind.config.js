/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'oklch(var(--color-primary-50) / <alpha-value>)',
          100: 'oklch(var(--color-primary-100) / <alpha-value>)',
          200: 'oklch(var(--color-primary-200) / <alpha-value>)',
          300: 'oklch(var(--color-primary-300) / <alpha-value>)',
          400: 'oklch(var(--color-primary-400) / <alpha-value>)',
          500: 'oklch(var(--color-primary-500) / <alpha-value>)',
          600: 'oklch(var(--color-primary-600) / <alpha-value>)',
          700: 'oklch(var(--color-primary-700) / <alpha-value>)',
          800: 'oklch(var(--color-primary-800) / <alpha-value>)',
          900: 'oklch(var(--color-primary-900) / <alpha-value>)',
          950: 'oklch(var(--color-primary-950) / <alpha-value>)',
        },
        surface: {
          50: 'oklch(var(--color-surface-50) / <alpha-value>)',
          100: 'oklch(var(--color-surface-100) / <alpha-value>)',
          200: 'oklch(var(--color-surface-200) / <alpha-value>)',
          300: 'oklch(var(--color-surface-300) / <alpha-value>)',
          400: 'oklch(var(--color-surface-400) / <alpha-value>)',
          500: 'oklch(var(--color-surface-500) / <alpha-value>)',
          600: 'oklch(var(--color-surface-600) / <alpha-value>)',
          700: 'oklch(var(--color-surface-700) / <alpha-value>)',
          800: 'oklch(var(--color-surface-800) / <alpha-value>)',
          900: 'oklch(var(--color-surface-900) / <alpha-value>)',
          950: 'oklch(var(--color-surface-950) / <alpha-value>)',
        },
        accent: {
          500: 'oklch(var(--color-accent-500) / <alpha-value>)',
          600: 'oklch(var(--color-accent-600) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-raleway)', 'sans-serif'],
        technical: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        // Advanced Fluid Spacing (320px -> 1920px)
        'fluid-3xs': 'clamp(0.25rem, 0.15vw + 0.2rem, 0.5rem)',
        'fluid-2xs': 'clamp(0.5rem, 0.3vw + 0.4rem, 0.875rem)',
        'fluid-xs': 'clamp(0.75rem, 0.5vw + 0.6rem, 1.25rem)',
        'fluid-sm': 'clamp(1rem, 0.75vw + 0.8rem, 1.75rem)',
        'fluid-md': 'clamp(1.5rem, 1.5vw + 1.2rem, 3rem)',
        'fluid-lg': 'clamp(2rem, 3vw + 1.5rem, 5rem)',
        'fluid-xl': 'clamp(3rem, 5vw + 2rem, 8rem)',
        'fluid-2xl': 'clamp(5rem, 8vw + 3rem, 12rem)',
        'fluid-3xl': 'clamp(8rem, 12vw + 4rem, 20rem)',
      },
      fontSize: {
        // Advanced Fluid Typography (Linear Scaling)
        'fluid-xs': 'clamp(0.7rem, 0.05vw + 0.68rem, 0.8rem)',
        'fluid-sm': 'clamp(0.8rem, 0.17vw + 0.76rem, 0.95rem)',
        'fluid-base': 'clamp(0.95rem, 0.3vw + 0.9rem, 1.15rem)',
        'fluid-lg': 'clamp(1.15rem, 0.6vw + 1rem, 1.5rem)',
        'fluid-xl': 'clamp(1.35rem, 1.2vw + 1.2rem, 2rem)',
        'fluid-2xl': 'clamp(1.75rem, 2.5vw + 1.2rem, 3rem)',
        'fluid-3xl': 'clamp(2.5rem, 4.5vw + 1.5rem, 4.5rem)',
        'fluid-4xl': 'clamp(3rem, 5vw + 2rem, 5.5rem)',
        'fluid-5xl': 'clamp(4rem, 8vw + 2rem, 7rem)',
      },
      borderRadius: {
        'fluid-sm': 'clamp(0.5rem, 1vw, 1rem)',
        'fluid-md': 'clamp(1rem, 2vw, 2rem)',
        'fluid-lg': 'clamp(2rem, 4vw, 4rem)',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(to right, oklch(var(--color-primary-600)), oklch(var(--color-primary-800)))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      animation: {
        'subtle-float': 'subtleFloat 6s ease-in-out infinite',
        'reveal-up': 'revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        subtleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      transitionTimingFunction: {
        'apex-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
};
