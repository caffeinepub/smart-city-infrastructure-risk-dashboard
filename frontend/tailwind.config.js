import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))'
        },
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))'
        },
        // Custom theme tokens
        navy: {
          DEFAULT: '#0A1929',
          50: '#e8f0f8',
          100: '#c5d8ed',
          200: '#9dbde0',
          300: '#74a2d3',
          400: '#4d88c6',
          500: '#2a6eb9',
          600: '#1a5499',
          700: '#0e3d78',
          800: '#072857',
          900: '#031536',
          950: '#010b1e',
        },
        teal: {
          DEFAULT: '#00D9FF',
          50: '#e0faff',
          100: '#b3f3ff',
          200: '#80ecff',
          300: '#4de5ff',
          400: '#1adfff',
          500: '#00D9FF',
          600: '#00aecf',
          700: '#00839f',
          800: '#00586f',
          900: '#002d3f',
        },
        amber: {
          DEFAULT: '#FFB800',
          50: '#fff8e0',
          100: '#ffedb3',
          200: '#ffe280',
          300: '#ffd74d',
          400: '#ffcc1a',
          500: '#FFB800',
          600: '#cc9300',
          700: '#996e00',
          800: '#664900',
          900: '#332500',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        'teal-glow': '0 0 20px oklch(0.72 0.18 195 / 0.3)',
        'amber-glow': '0 0 20px oklch(0.78 0.16 85 / 0.3)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'pulse-teal': {
          '0%, 100%': { boxShadow: '0 0 0 0 oklch(0.72 0.18 195 / 0.4)' },
          '50%': { boxShadow: '0 0 0 8px oklch(0.72 0.18 195 / 0)' },
        },
        'counter-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-teal': 'pulse-teal 2s ease-in-out infinite',
        'counter-up': 'counter-up 0.5s ease-out',
      }
    }
  },
  plugins: [typography, containerQueries, animate]
};
